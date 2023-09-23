const express = require("express")
const { getClients, getName, createClient, updateClient, deleteClient } = require("../controller/Client")
const { verifyAdmin } = require("../utils/TokenVerify")

const router = express.Router()

router.get("/" ,verifyAdmin ,getClients)
router.get("/getName" ,verifyAdmin ,getName)
router.post("/create" ,verifyAdmin , createClient)
router.post("/update/:id" ,verifyAdmin , updateClient)
router.delete("/delete/:id" , verifyAdmin , deleteClient)


module.exports = router