const express = require("express");
const { getAllItems, getItem } = require("../../controllers/items");

const itemRoutes = express.Router();

itemRoutes.get("/items", getAllItems);
itemRoutes.get("/items/:id", getItem);

module.exports = itemRoutes;
