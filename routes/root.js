
const express = require("express");
const rootRoute = express.Router()


//Inicio OPCIONAL

rootRoute.get("/",(request, response) => {
    response.send("<h1>Hola</h1>");
  });

module.exports = rootRoute;