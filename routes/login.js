const mongoose = require('mongoose');
const {User,validate} = require('../models/user');
const { required } = require('joi');
const router = require("express").Router();
const bcrypt = require('bcrypt');


router.post("/",async (req,res)=>{
    console.log(req.body.email);
    if(!req.body.email)return res.status(400).json({msg:"Email required"});
    if(!req.body.password)return res.status(400).json({msg:"Invalid Password"});

    const user = await User.findOne({email:req.body.email});

    if(!user)return res.status(400).json({msg:"User Not Found"});
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword)res.status(400).json({msg:"wrong password"});

    const token = await user.generateAuthToken();

    return res.status(200).json({token:token});
})

module.exports = router;