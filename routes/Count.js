const express = require("express");
const clientModel = require("../models/clientModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const { verifyAdmin } = require("../utils/TokenVerify");

const router = express.Router()


router.get("/", verifyAdmin, async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [orders, clients, products] = await Promise.all([
      orderModel.find({
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      }),
      clientModel.countDocuments({
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      }),
      productModel.countDocuments({
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      }),
    ]);

    let totalProfit = 0;
    for (const order of orders) {
      totalProfit += +(order.total);
    }

    res.status(200).send({
      order: orders.length,
      product: products,
      client: clients,
      revenue: totalProfit,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/getYear", verifyAdmin, async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const countsByMonth = await Promise.all(
      months.map(async (month) => {
        const firstDayOfMonth = new Date(currentYear, month - 1, 1);
        const lastDayOfMonth = new Date(currentYear, month, 0);

        const ordersInMonth = await orderModel.find({
          createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        });

        return {
          month,
          count: ordersInMonth.length,
        };
      })
    );
    const countsByMonthPrice = await Promise.all(
      months.map(async (month) => {
        const firstDayOfMonth = new Date(currentYear, month - 1, 1);
        const lastDayOfMonth = new Date(currentYear, month, 0);

        const ordersInMonth = await orderModel.find({
          createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        });

        let profitInMonth = 0;
        for (const order of ordersInMonth) {
          profitInMonth += +(order.total);
        }
        return {
          month,
          count: profitInMonth,
        };
      })
    );

    res.status(200).json({ order: countsByMonth , revenue: countsByMonthPrice });
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router
