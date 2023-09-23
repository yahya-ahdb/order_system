const mongoose = require("mongoose")

const CompanyShema = new mongoose.Schema({
    title : {
        type :String,
        required : true
    },
    address : {
        type :String,
        required : true
    },
    secondary_address : {
        type :String,
        required : true
    },
    email : {
        type :String,
        required : true
    },
    phone  : {
        type :String,
    },
}, {timestamps : true})

module.exports = mongoose.model("Company",CompanyShema)
