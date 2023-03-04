const express = require("express");
const app = express();
const cors = require("cors");
const itemRoutes = require('./routes/items')
const rootRoute = require('./routes/root')

app.use(cors());
app.use('/api', itemRoutes);
app.use('/', rootRoute)



module.exports = app;