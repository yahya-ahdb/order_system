const express = require("express")
const { verifyAdmin } = require("../utils/TokenVerify")
const { getProduct, getTitles, createProduct, updateProduct, deleteProduct, getProductsCountThisMonth, getProductsCountByMonth } = require("../controller/Product")
const productModel = require("../models/productModel")

const router = express.Router()

router.get("/" ,verifyAdmin , getProduct)
router.get("/getTitle" ,verifyAdmin , getTitles)
router.get("/getOptions/:value" ,verifyAdmin , async(req,res)=>{
    try {
        const product = await productModel.findOne({ title :req.params.value})
        
        res.status(200).send(product)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.post("/create" ,verifyAdmin , createProduct)
router.post("/update/:id" ,verifyAdmin ,updateProduct)
router.delete("/delete/:id" ,verifyAdmin , deleteProduct)

module.exports = router