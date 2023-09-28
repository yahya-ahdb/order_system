const express = require("express")
const { verifyAdmin } = require("../utils/TokenVerify")
const { getCompany, getName, createCompany, updateCompany, deleteCompany } = require("../controller/Company")

const router = express.Router()

router.get("/" ,verifyAdmin ,getCompany)
router.get("/getName" ,verifyAdmin ,getName)
router.post("/create" ,verifyAdmin , createCompany)
router.post("/update/:id" ,verifyAdmin , updateCompany)
router.delete("/delete/:id" , verifyAdmin , deleteCompany)


module.exports = router