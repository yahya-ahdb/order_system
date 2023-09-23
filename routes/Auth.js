const express = require("express")
const { createUser, LoginAuth } = require("../controller/Auth")

const router = express.Router()

router.post("/create" , createUser)

router.post("/login" , LoginAuth)

module.exports = router