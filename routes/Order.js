const express = require("express");
const { verifyAdmin } = require("../utils/TokenVerify");
const {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrders,
  getTitles,
  GetDataPdf,
  ExprotData,
} = require("../controller/Order");
const multer = require("multer");
const XLSX = require("xlsx");
const orderModel = require("../models/orderModel");
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", verifyAdmin, getOrders);
router.get("/getTitle", verifyAdmin, getTitles);
router.post("/create", verifyAdmin, createOrder);
router.post("/update/:id", verifyAdmin, updateOrder);
router.delete("/delete/:id", verifyAdmin, deleteOrder);
router.get("/export", ExprotData);
router.get("/export-pdf", GetDataPdf);
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const formattedData = data.map((item) => {
      let optionsArray = [];

      if (typeof item.options === "string") {
        optionsArray = item.options.split(",").map((opt) => opt.trim());
      } else if (Array.isArray(item.options)) {
        optionsArray = item.options;
      }

      return {
        ...item,
        options: optionsArray
          .filter((opt) => opt.trim() !== "")
          .map((opt) => {
            const optionsArray = opt.split("||").map((part) => part.trim());
            const [product, color, size, qty, price] = optionsArray;

            return {
              product: product,
              color: color,
              size: size,
              qty: qty,
              price: price,
            };
          }),
      };
    });

    await orderModel.insertMany(formattedData);

    return res.status(200).send("Data uploaded successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred.");
  }
});

module.exports = router;
// const formattedData = data.map((item) => {
//   const optionsArray = item.options.split(' || ');
//   const [product, color, size, qty, price] = optionsArray;

//   return {
//     ...item,
//     options: {
//       product: product,
//       color: color,
//       size: size,
//       qty: qty,
//       price: price
//     }
//   };
// });
