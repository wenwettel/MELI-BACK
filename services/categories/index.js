const fetch = require("node-fetch");
const fetchCategoryById = async (id) => {
    return await fetch(`https://api.mercadolibre.com/categories/${id}`).then(res => res.json());
}

module.exports = {
    fetchCategoryById
}

