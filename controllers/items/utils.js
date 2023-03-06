const { fetchCategoryById } = require("../../services/categories");
const { fetchItemDescriptionById } = require("../../services/items");

const extractDecimals = (number) => {
  let priceToString = number?.toString();
  if (priceToString?.includes(".")) {
    const indice = priceToString.indexOf(".");
    decimalNumber = priceToString.substring(indice + 1, number.length);
    return Number(decimalNumber);
  }
};

const getCategoriesRoot = async (id) => {
  try {
    const category = await fetchCategoryById(id);
    const categoriesRoot = category?.data?.path_from_root?.map(
      (cateRoot) => cateRoot.name
    );
    return categoriesRoot;
  } catch (err) {
    console.error(err);
    return [];
  }
};

/*verifica si la busqueda de los items ya viene con el filtro categoria aplicado;
  ya que si esta aplicado no aparece en los "available_filters"*/

const getItemsCategories = async (items) => {
  if (!items) return [];
  const availableFilters = items.available_filters?.find(
    (filter) => filter.id === "category"
  );
  if (availableFilters) {
    const categoriesSort = availableFilters?.values.sort(
      (a, b) => b.results - a.results
    );
    const maxCategoryResult = categoriesSort[0];
    if (!maxCategoryResult) return [];
    return await getCategoriesRoot(maxCategoryResult.id);
  }
  const filtersApplied = items.filters?.find((filter) => {
    return filter.id === "category";
  });
  if (!filtersApplied || filtersApplied.length === 0) return [];
  return filtersApplied.values[0]?.path_from_root?.map(
    (category) => category.name
  );
};

const getItemDescriptionById = async (id) => {
  try {
    return await fetchItemDescriptionById(id);
  } catch (err) {
    console.error(err);
    return {
      text: "",
      plain_text: "",
    };
  }
};

module.exports = {
  extractDecimals,
  getCategoriesRoot,
  getItemsCategories,
  getItemDescriptionById,
};
