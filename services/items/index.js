const axios = require("axios")

const fetchItems = async (query) => {
    return await axios(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`);
}

const fetchItemById = async (id) => {
    return await axios(`https://api.mercadolibre.com/items/${id}`);
}

const fetchItemDescriptionById = async (id) => {
    return await axios(`https://api.mercadolibre.com/items/${id}/description`);
}


module.exports = {
    fetchItemById,
    fetchItems,
    fetchItemDescriptionById
}

