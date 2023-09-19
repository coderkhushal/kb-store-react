const express = require('express')
const router= express()
const User= require("../models/user")
const { body, validationResult } = require("express-validator")
const bcrypt = require('bcryptjs');
const secretstr="khushalisagoodboy"
const jwt= require("jsonwebtoken");
const product = require('../models/product');


 //Route-1 signup using POST:/kbstore/seller/signup , no login required
router.post("/signup",
[
    body("name","enter a valid name").isLength({min:2}),
    body("address","address cannot be empty").isLength({min:1}),
    body("password","password must have atleast 5 characters").isLength({min:5}),
    body("email","enter a valid email").isEmail(),
    body("phone","enter a valid phone number").isLength({min:10,max:10}),
], async (req, res) => {
    try {
        const errors= validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
        }
        else{
            var salt = bcrypt.genSaltSync(10);
            var secpass = bcrypt.hashSync(req.body.password, salt);
            let user= await User.create({
                name:req.body.name,
                address:req.body.address,
                email:req.body.email,
                phone:req.body.phone,
                password:secpass,
            })
            let token =jwt.sign({user:{id:user.id}}, secretstr);

            res.json({token:token,success:true})
        }

    } catch (err) {
        res.status(400).json({ error:err })
    }

})

//Route-2 login using POST:/kbstore/users/login , no login required
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
            let user= await User.findOne({email:req.body.email});
    
            if(!user){
                res.status(400).json({error:"Not found"})
            }
            else{
                let checkingpass= await bcrypt.compareSync(req.body.password,user.password);
                if(!checkingpass){
                    res.status(400).json({error:"invalid credentials"})
                }
                else{
                    let token =jwt.sign({user:{id:user.id}}, secretstr);
                    res.json({token:token,success:true})
                }
            }
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({ error:err })
    }

})

//fetch all products
router.get("/products", async(req, res)=>{
    const token= req.header("auth-token")

    const data = jwt.verify(token,secretstr)
    const user  = await User.findById(data.user.id)
    if(!user){
        res.status(400).json({error:"use valid token to access"})
    }
    else{
        const productsarr = await product.find()
        res.json({products:productsarr , success:true})
    }

    
})



//fetch all products
router.get("/allproducts",async(req,res)=>{
    const token = req.header("auth-token")
    const data = jwt.verify(token , secretstr)
    const user = await User.findById(data.user.id)
    if(!user){
        res.json({error:"user does not exists"})
    }
    else{
        const products = await product.find()
        res.json({products:products, success:true})
    }
})
module.exports = router