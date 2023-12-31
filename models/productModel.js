const mongoose = require("mongoose")

const ProductShema = new mongoose.Schema({
    title : {
        type :String,
        required : true
    },
    price : {
        type :String,
        required : true
    },
    description  : {
        type :String,
        required : true
    },
    category  : {
        type :String,
        required : true
    },
    options  : {
        type :Array,
        required : true
    },
}, {timestamps : true})

module.exports = mongoose.model("Products",ProductShema)
