const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors= require("cors")
require('dotenv').config();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json())
const connecttomongoose=require("./db")
connecttomongoose()

app.use('/kbstore/users', require('./routes/user'))
app.use('/kbstore/seller',require("./routes/Seller"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})