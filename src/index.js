const express = require("express");
const app = express();
const port = 3000;
const indexRoutes = require("./routes/index.routes.js");
const bodyParser = require('body-parser');

app.use(express.json()); 
app.use(bodyParser.json()); 

const cors = require("cors");
// require("dotenv").config();

//Cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Pokemons Api!");
});

app.listen(port, () => {
  console.log(`Yowl api listening on port ${port}`);
});

// Init Routes
app.use("/pokemons", indexRoutes);
