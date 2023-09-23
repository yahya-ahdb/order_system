const express = require("express")
const dotenv= require("dotenv")
const mongoose =require("mongoose")
const cors =require("cors")
const authRoute = require("./routes/Auth")
const orderRoute = require("./routes/Order")
const productRoute = require("./routes/Product")
const clientRoute = require("./routes/Client")
const categoryRoute = require("./routes/Category")
const countRoute = require("./routes/Count")


dotenv.config()
const app = express()
app.use(express.json())

app.use(cors())
mongoose.connect(process.env.DB)
.then(()=>{
    console.log('DBdatabase connacted');
}).catch((err)=>{
    console.log("error in DB " +err);
});


app.use("/api/auth", authRoute)
app.use("/api/order", orderRoute)
app.use("/api/client", clientRoute)
app.use("/api/product", productRoute)
app.use("/api/category", categoryRoute)
app.use("/api/analytic", countRoute)

const PORT = process.env.PORT || 8000
app.listen(PORT,(req,res)=>{
    console.log("Server in port="+PORT);
})

