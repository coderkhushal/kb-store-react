const  mongoose = require("mongoose")

const fileschema = mongoose.Schema({
    originalname:{
        type:String
    },
    filename:{
        type:String

    },
    size:{
        type:Number
    },
    mimetype:{
        type:String
    }

})

module.exports = mongoose.model("file", fileschema)