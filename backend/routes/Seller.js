const express = require('express')
const router = express()
const Seller = require("../models/seller")
const { body, validationResult } = require("express-validator")
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
const secretstr="khushalisagoodboy"
const fetchseller = require("../middleware/fetchseller")
const product = require('../models/product');
const multer  = require('multer')
const upload = multer({dest: 'uploads/' })

   //Route-1 signup using POST:/kbstore/seller/signup , no login required
router.post("/signup",
    [
        body("name", "enter a valid name").isLength({ min: 2 }),
        body("address", "address cannot be empty").isLength({ min: 1 }),
        body("password", "password must have atleast 5 characters").isLength({ min: 5 }),
        body("email", "enter a valid email").isEmail(),
        body("phone", "enter a valid phone number").isLength({ min: 10, max: 10 }),
    ], async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({ error: errors.array() })
            }
            else {
                var salt = bcrypt.genSaltSync(10);
                var secpass = bcrypt.hashSync(req.body.password, salt);
                let seller = await Seller.create({
                    name: req.body.name,
                    address: req.body.address,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: secpass,
                })
                let token =jwt.sign({seller:{id:seller.id}}, secretstr);
                res.json({token:token,success:true})
            }

        } catch (err) {
            res.status(400).json({ error: err })
        }
    })
//Route-2 login using POST:/kbstore/seller/login , no login required
router.post("/login",
[
    body("password","password must have atleast 5 characters").isLength({min:5}),
    body("email","enter a valid email").isEmail(),

], async (req, res) => {
    try {
        const errors= validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
        }
        else{
            let seller= await Seller.findOne({email:req.body.email});
            
            if(!seller){
                res.status(400).json({error:"Not found"})
            }
            else{
                let checkingpass= await bcrypt.compareSync(req.body.password,seller.password);
                if(!checkingpass){
                    res.status(400).json({error:"invalid credentials"})
                }
                else{
                    let token =jwt.sign({user:{id:seller.id}}, secretstr);
                    res.json({token:token,success:true})
                }
            }
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({ error:err })
    }

})

//ROUT-3 create product using POST:/kbstore/seller/product , login required
router.post("/createproduct",fetchseller,async (req,res)=>{
    try{const {name, price, specifications} = req.body;

    const Product = await product.create({
        seller:req.seller.id,
        name:name,
        price:price,
        specifications:specifications
    })
    res.send({Product, success:true})}catch(err){
        console.log(err)
        res.status(400).json({error:err})
    }
}) 

//ROUTE -4 fetch products of the selller  using GET:/kbstore/seller/myproducts , login required
router.get("/myproducts",fetchseller, async(req,res)=>{
    try{
        
        let Products = await product.find({seller:req.seller.id}) 
        if(!Products){
            res.json({error:"No products exist",success:false})
        }
        else{
            res.send({products:Products , success:true})
        }
    }catch(err){
        console.log(err)
        res.status(400).json({error:"Internal Server Error"})
    }
})


//ROUTE-5 removing the product using delete:/kbstore/seller/deleteproduct , Login required
router.delete("/deleteproduct/:id",async(req,res)=>{
    try{
    const token = await req.header("auth-token")
    if(!token){
        res.status(400).json({error:"Token not found"})
    }else{

        //fetching product
        let Product= await product.findById(req.params.id) 
        if(!Product){
            res.status(400).json({error:"Product Does not exists",product:Product})
        }
        //finding user's id
        const data = jwt.verify(token, secretstr)
        //checking if token is of same seller who wants to delete it or not
        if(Product.seller== data.user.id){
            Product = await product.findByIdAndDelete(req.params.id)
            res.json({success:true})
        }
        else{
            res.status(401).json({success:false,error:"not authorised"})
        }

    }
    }catch(err){
        console.log(err)
        res.status(400).json({error:"Internal server error"})
    }
})

router.post('/image', upload.single('pdfs'), async (req, res, next) => {
    console.log(req.file)
})
module.exports = router