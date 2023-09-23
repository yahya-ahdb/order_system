const express = require("express")
const { verifyAdmin } = require("../utils/TokenVerify")
const { getCategory, createCategory, updateCategory, deleteCategory, getTitle } = require("../controller/Category")

const router = express.Router()

router.get("/" , verifyAdmin , getCategory)
router.get("/getTitle" , verifyAdmin , getTitle)
router.post("/create", verifyAdmin ,createCategory)
router.post("/update/:id", verifyAdmin ,updateCategory)
router.delete("/delete/:id", verifyAdmin ,deleteCategory)


module.exports = router