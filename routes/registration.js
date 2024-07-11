const router = require('express').Router();
const {User,validate} = require("../models/user");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

router.post("/",async(req,res)=>{
    const {error} = validate(req.body);
    
    if(error)return res.status(400).json({
        message:"There is some eroor",
        err:error.details[0].message
    })
    const user_email = await User.findOne({ email: req.body.email });
    if(user_email)return res.send(400).json({message:"already user with this email"});

    const user_name = await User.findOne({ email: req.body.username });
    if(user_name)return res.send(400).json({message:"already user with this user_name"});
    
    const salt = await bcrypt.
    genSalt(5);
    const hashpassword = await bcrypt.hash(req.body.password,salt);
    let newuser = await new User({
        ...req.body,
        password:hashpassword
    })
    await newuser.save();
    console.log(newuser);
})

module.exports = router;