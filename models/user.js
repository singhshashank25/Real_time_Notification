const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const pwdComplexity = require("joi-password-complexity");
require("dotenv").config();

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email: {type:String, required:true, unique: true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    connected:{type:Boolean,default:true}
})

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign(
        {_id: this._id, name:this.name, email:this.email},
        process.env.JWTSECRET,
        { expiresIn: "7d" }
    );
    return token;
};

const validate = (user) => {
	const schema = Joi.object({
		name: Joi.string().required(),
        username: Joi.string().required(),
		email: Joi.string().email().required(),
		password: pwdComplexity().required()
	});
	return schema.validate(user);
};

const User = mongoose.model("User",userSchema);

module.exports = {User,validate};