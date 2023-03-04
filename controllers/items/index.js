const {fetchItems,fetchItemById,fetchItemDescriptionById} = require('../../services/items')
const {extractDecimals, fetchItemsCategories, getCategoriesRoot} = require('./utils')


const getAllItems = async (request, response) => {
    const query = request.query?.q;
  
    //search general
    const items = await fetchItems(query)
  
    //breadcrumbs
    const categoriesRoot = await fetchItemsCategories(items);
    
  
    //results format
    const itemsFormat = items.results.slice(0, 4).reduce((acum, currentItem) => {
      const decimalPrice = extractDecimals(currentItem.price);
  
      const newFormat = {
        id: currentItem.id,
        title: currentItem.title,
        price: {
          currency: currentItem.currency_id,
          amount: Math.trunc(currentItem.price),
          decimals: decimalPrice ? decimalPrice : null,
        },
        picture: currentItem?.thumbnail,
        condition: currentItem?.condition,
        free_shipping: currentItem?.shipping.free_shipping,
        state_name:currentItem.address?.state_name
      };
      return [...acum, newFormat];
    }, []);
  
    //Formato del response
    const formatData = {
      author: {
        name: "Wendy",
        lastName: "Wettel",
      },
      categories: categoriesRoot ? categoriesRoot : [],
      items: itemsFormat,
    };
  
    //verificar el status
    response.status(200).json(formatData);
}

const getItem = async (request, response) => {
        const idParam = request.params.id;
        let item = await fetchItemById(idParam)
        let {
          id,
          title,
          currency_id,
          price,
          pictures,
          condition,
          shipping,
          sold_quantity,
          category_id,
        } = item;
        const decimalPrice = extractDecimals(price);
      
        //categorias para el breadcrumb
        const categoriesRoot = await getCategoriesRoot(category_id);
      
        //consulta del detalle
        const description = await fetchItemDescriptionById(idParam)
        let { text, plain_text } = description;
      
        /*Formato del response */
        const formatData = {
          author: {
            name: "Wendy",
            lastName: "Wettel",
          },
          categories: categoriesRoot ? categoriesRoot : [],
          item: {
            id,
            title,
            price: {
              cuerrency: currency_id,
              amount: Math.trunc(price),
              decimals: decimalPrice ? decimalPrice : null,
            },
            picture: pictures && pictures[0]?.url,
            condition,
            free_shipping: shipping?.free_shipping,
            sold_quantity,
            description: plain_text !== "" ? plain_text : text,
          },
        };
      
        //verificar el status
        response.status(200).json(formatData);
}




module.exports = {
    getItem,
    getAllItems
}