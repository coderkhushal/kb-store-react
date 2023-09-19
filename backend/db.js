
const mongoose = require('mongoose');

async function connecttomongoose() {
  await mongoose.connect('mongodb://127.0.0.1:27017/KB-store');
}
module.exports= connecttomongoose