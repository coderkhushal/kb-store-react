const mongoose =  require("mongoose")

const productschema= new mongoose.Schema({
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"seller"
    },
    name:{
        requred:true,
        type:String
    },
    price:{
        requred:true,
        type:Number
    },
    specifications:{
        requred:true,
        type:String
    },
})

module.exports = mongoose.model("product",productschema)