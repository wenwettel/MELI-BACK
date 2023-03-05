const { fetchItems, fetchItemById } = require("../../services/items");
const {
  extractDecimals,
  getItemsCategories,
  getCategoriesRoot,
  getItemDescriptionById,
} = require("./utils");

const getAllItems = async (request, response) => {
  const query = request.query?.q;
  try{
    //search general
  const items = await fetchItems(query);
 
  //breadcrumbs
  const categoriesRoot = await getItemsCategories(items?.data);

  //results format
  const itemsFormat = items?.data?.results?.slice(0, 4).reduce((acum, currentItem) => {
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
      state_name: currentItem.address?.state_name,
    };
    return [...acum, newFormat];
  }, []);

  //Formato del response
  const formatData = {
    author: {
      name: "Wendy",
      lastName: "Wettel",
    },
    categories: categoriesRoot,
    items: itemsFormat || [],
  };
  response.status(200).json(formatData);

  }catch(error){
    console.error(error)
    response.status(404).send("resource not found");
  }
  
};

const getItem = async (request, response) => {
  try {
    const idParam = request.params.id;
    const item = await fetchItemById(idParam);
 
    const {
      id,
      title,
      currency_id,
      price,
      pictures,
      condition,
      shipping,
      sold_quantity,
      category_id,
    } = item?.data;
    const decimalPrice = extractDecimals(price);

    //categorias para el breadcrumb
    const categoriesRoot = await getCategoriesRoot(category_id);

    //consulta del detalle
    const description = await getItemDescriptionById(idParam);
    
    const { text, plain_text } = description?.data;

    const objectResponseItem = {
      id,
      title,
      price: {
        cuerrency: currency_id,
        amount: price ? Math.trunc(price) : null,
        decimals: decimalPrice ? decimalPrice : null,
      },
      picture: pictures?.[0]?.url,
      condition,
      free_shipping: shipping?.free_shipping,
      sold_quantity,
      description: plain_text !== "" ? plain_text : text,
    };

    /*Formato del response */
    const formatData = {
      author: {
        name: "Wendy",
        lastName: "Wettel",
      },
      categories: categoriesRoot,
      item: objectResponseItem,
    };

    response.status(200).json(formatData);
  } catch (error) {
    console.error(error);
    response.status(404).send("resource not found");
  }
};

module.exports = {
  getItem,
  getAllItems,
};
