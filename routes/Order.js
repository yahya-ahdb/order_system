const express = require("express")
const { verifyAdmin } = require("../utils/TokenVerify")
const { createOrder, updateOrder, deleteOrder, getOrders, getTitles, GetDataPdf, ExprotData } = require("../controller/Order")
const multer = require('multer');
const XLSX  = require('xlsx');
const orderModel = require("../models/orderModel");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const router = express.Router()

router.get("/" ,verifyAdmin , getOrders)
router.get("/getTitle" ,verifyAdmin , getTitles)
router.post("/create" ,verifyAdmin , createOrder)
router.post("/update/:id" ,verifyAdmin ,updateOrder)
router.delete("/delete/:id" ,verifyAdmin , deleteOrder)
router.get('/export', ExprotData);
router.get('/export-pdf' , GetDataPdf);
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).send('No');
        }
    
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        await orderModel.insertMany(data);
    
        return res.status(200).send('Yes');
      } catch (error) {
        return res.status(500).send("error");
      }
});

module.exports = router