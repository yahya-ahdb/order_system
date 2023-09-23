const mongoose = require("mongoose")

const AuthShema = new mongoose.Schema({
    name :{
        type: String,
        required : true
    },
    email :{
        type: String,
        required : true,
        unique: true
    },
    password :{
        type: String,
        required : true
    },
    role_id :{
        type: String,
        required : true,
        default :"1"
    },
})

module.exports = mongoose.model("Users" , AuthShema )