const mongoose = require("mongoose")

const CategoryShema = new mongoose.Schema({
    title : {
        type :String,
        required : true
    },
    description : {
        type :String,
    },
}, {timestamps : true})

module.exports = mongoose.model("Category",CategoryShema)
