const express = require("express");
const clientModel = require("../models/clientModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const { verifyAdmin } = require("../utils/TokenVerify");

const router = express.Router()


router.get("/" , verifyAdmin , async (req, res) => {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
      const countClient = await clientModel.countDocuments({
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      });
      const countProduct = await productModel.countDocuments({
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      });
      const countOrder = await orderModel.countDocuments({
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      });
  
      res.status(200).send({ order : countOrder , product : countProduct , client  :countClient });
    } catch (error) {
      res.status(500).send(error);
    }
  }
)

router.get("/getYear" , verifyAdmin , async (req, res) => {
  try {
    const orders =await orderModel.find();
    const products = await productModel.find();

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const countsByMonth = months.map((month) => {
      const ordersInMonth = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() + 1 === month;
      });
      return {
        month,
        count: ordersInMonth.length,
      };
    })
    
    const countsByMonthProduct = months.map((month) => {
      const productsInMonth = products.filter((product) => {
        const productDate = new Date(product.createdAt);
        return productDate.getMonth() + 1 === month;
      });

      return {
        month,
        count: productsInMonth.length,
      };
    })

    res.status(200).json({ order :countsByMonth , product :countsByMonthProduct });
  } catch (error) {
    res.status(500).send(error);
  }
}
)


module.exports = router
