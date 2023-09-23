const express = require("express")
const { verifyAdmin } = require("../utils/TokenVerify")
const { getProduct, getTitles, createProduct, updateProduct, deleteProduct, getProductsCountThisMonth, getProductsCountByMonth } = require("../controller/Product")

const router = express.Router()

router.get("/" ,verifyAdmin , getProduct)
router.get("/getTitle" ,verifyAdmin , getTitles)
router.post("/create" ,verifyAdmin , createProduct)
router.post("/update/:id" ,verifyAdmin ,updateProduct)
router.delete("/delete/:id" ,verifyAdmin , deleteProduct)

module.exports = router