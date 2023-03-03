const express = require("express");
const fetch = require("node-fetch");
const app = express();

const extractDecimals = (number) =>{
    let priceToString = number?.toString()
    if(priceToString.includes('.')){
        const indice = priceToString.indexOf('.')
        decimalNumber = priceToString.substring(indice+1,number.length) 
        return Number(decimalNumber)
    }
}

const getCategoriesRoot = async (id) =>{
    let res = await fetch(`https://api.mercadolibre.com/categories/${id}`)
    let category = await res.json()
    const categoriesRoot = category.path_from_root.map(
        (cateRoot) => cateRoot.name
      );  
    return categoriesRoot
}

//ENDPOINT :Search Items 
app.get("/api/items", async (request, response) => {
  const query = request.query?.q;

    //search general 
    let resData = await fetch(
      `https://api.mercadolibre.com/sites/MLA/search?q=${query}`
    );
    let items = await resData.json();

    //selecciona la categoria con mayor resultados 
    //validar aqui en caso de que no aparezca categorys en los available filters
    const categories = items.available_filters
      .find((filter) => filter.id === "category")?.values.sort((a, b) => b.results - a.results);
    const maxCategoryResult = categories[0];

    //categorias de los breadcrumbs
    const categoriesRoot = await getCategoriesRoot(maxCategoryResult.id)

    //results format 
    const itemsFormat = items.results.slice(0,4).reduce((acum, currentItem) => {
       const decimalPrice = extractDecimals(currentItem.price);
        
        const newFormat ={
            id: currentItem.id,
            title:currentItem.title,
            price:{
                currency: currentItem.currency_id,
                amount: Math.trunc(currentItem.price),
                decimals: decimalPrice? decimalPrice : null
            },
            picture:currentItem.thumbnail,
            condition:currentItem.condition,
            free_shipping:currentItem.shipping.free_shipping

        }
        return [...acum, newFormat]
    },[])

    //Formato del response 
      const formatData = {
        author: {
          name: "Wendy",
          lastName: "Wettel",
        },
        categories: categoriesRoot? categoriesRoot : [],
        items: itemsFormat
      };

    //verificar el status
    response.status(200).json(formatData);
});


/*ENDPOINT : Item Detail */

app.get("/api/items/:id", async (request, response) => {
  const idParam = request.params.id;
  let resData = await fetch(
    `https://api.mercadolibre.com/items/${idParam}`
  );
  let item = await resData.json();
  let {id, title, currency_id, price, pictures, condition, shipping, sold_quantity, category_id } = item
  const decimalPrice = extractDecimals(price);

//categorias para el breadcrumb
 const categoriesRoot = await getCategoriesRoot(category_id)

  //consulta del detalle
  let res= await fetch(
    `https://api.mercadolibre.com/items/${idParam}/description`
  );
  let description = await res.json();
 let {text, plain_text} = description


  
 
/*Formato del response */
  const formatData = {
    author: {
      name: "Wendy",
      lastName: "Wettel",
    },
    categories:categoriesRoot? categoriesRoot:[] ,
    item:{
       id, 
       title,
       price:{
        cuerrency: currency_id,
        amount: Math.trunc(price),
        decimals: decimalPrice? decimalPrice: null
       },
       picture: pictures[0].url,
       condition,
       free_shipping: shipping.free_shipping,
       sold_quantity,
       description: plain_text !== '' ? plain_text: text
    }
  };

  //verificar el status
  response.status(200).json(formatData);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})
