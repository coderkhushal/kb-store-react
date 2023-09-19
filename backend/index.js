const express = require('express')
const app = express()
const port = 5000
const cors= require("cors")
app.use(cors())
app.use(express.json())
const connecttomongoose=require("./db")
connecttomongoose()

app.use('/kbstore/users', require('./routes/user'))
app.use('/kbstore/seller',require("./routes/Seller"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})