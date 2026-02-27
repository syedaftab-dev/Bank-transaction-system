const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    
    email:{
        type: String,
        required: [true,"Email is required for creating a user"],
        unique: [true,"Email already exist."],
        trim: true, // trim spaces
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
    },
    name: {
        type: String,
        required: [true,"Name is required for creating a user"],  
    },
    password: {
        type: String,
        required: [true,"Password is required for creating a user"],
        minlength: [6,"Password must be at least 6 characters long"],
        select: false, // not show password in response
    },
},{
    timestamps: true,   
})

// pre -> runs before saving the user
userSchema.pre("save",async function(next){
    // if password is not modified then return
    if(!this.isModified("password")){
        return next();
    }
    // hash the password
    const hash = await bcrypt.hash(this.password,10); 

    this.password = hash;

    return next();
})

// compare password with hashed password in database and return true or false
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}


const userModel = mongoose.model("user",userSchema);

module.exports = userModel;