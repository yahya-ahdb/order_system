const mongoose = require("mongoose")

const OrderShema = new mongoose.Schema({
    phone :{
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
    total : {
        type :String,
        required : true
    },
    productName : {
        type :String,
        required : true
    },
    company : {
        type :String,
        required : true
    },
    options :{
        type :Array,
        required : true
    },
    paymentStatus :{
        type :String,
        default :"unpaid"
    }
}, {timestamps : true})

module.exports = mongoose.model("Orders",OrderShema)
