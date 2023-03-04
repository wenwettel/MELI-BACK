const fetch = require("node-fetch");

const fetchItems = async (query) => {
    return await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`).then(res => res.json());
}

const fetchItemById = async (id) => {
    return await fetch(`https://api.mercadolibre.com/items/${id}`).then(res => res.json());
}

const fetchItemDescriptionById = async (id) => {
    return await fetch(`https://api.mercadolibre.com/items/${id}/description`).then(res => res.json());
}


module.exports = {
    fetchItemById,
    fetchItems,
    fetchItemDescriptionById
}

