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
    if(user_email)return res.status(409).json({message:"already user with this email"});

    const user_name = await User.findOne({ email: req.body.username });
    if(user_name)return res.status(409).json({message:"already user with this user_name"});
    
    const salt = await bcrypt.
    genSalt(5);
    const hashpassword = await bcrypt.hash(req.body.password,salt);
    let newuser = await new User({
        ...req.body,
        password:hashpassword
    })
    await newuser.save();
    console.log(newuser);
    return res.status(200).json({msg:"User is Created Successfully"});
})

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       400:
 *         description: Validation error or other error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 err:
 *                   type: string
 *       409:
 *         description: Conflict - user with the provided email or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

module.exports = router;