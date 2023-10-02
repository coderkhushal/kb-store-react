
const mongoose = require('mongoose');
// const uri = "mongodb://127.0.0.1:27017/KB-store"
const uri = process.env.URI_STRING
async function connecttomongoose() {
  await mongoose.connect(uri,{
    useUnifiedTopology:true,
    useNewUrlParser:true
});
}
module.exports= connecttomongoose
