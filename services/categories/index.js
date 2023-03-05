const axios = require("axios")

const fetchCategoryById = async (id) => {
    return await axios(`https://api.mercadolibre.com/categories/${id}`);
}

module.exports = {
    fetchCategoryById
}

