const express = require("express");
const rootRoute = express.Router();

//Inicio OPCIONAL

rootRoute.get("/", (request, response) => {
  response.send("<h1>Api Home</h1>");
});

module.exports = rootRoute;
