const mongoose = require("mongoose")

const OrderShema = new mongoose.Schema({
    title : {
        type :String,
        required : true
    },
    client : {
        type :String,
        required : true
    },
    status : {
        type :String,
        required : true,
        default : "pending"
    },
    first_date : {
        type :String,
        required : true
    },
    end_date : {
        type :String,
        required : true
    },
    qty : {
        type :String,
        required : true
    },
    price : {
        type :String,
        required : true
    },
    productName : {
        type :String,
        required : true
    },
}, {timestamps : true})

module.exports = mongoose.model("Orders",OrderShema)
