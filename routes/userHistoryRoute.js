const express = require("express");
const router = express.Router();
const moment = require("moment");

const { User } = require("../models/dataModel");

router.get("/api/user/:id/history", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("orders");

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    res.json(user.orders);
  } catch (error) {
    console.error(error);
  }
});

router.get("/api/user/status/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate({
      path: "orders",
      populate: {
        path: "cart",
        select: "name price quantity"
      }
    });

    if (!user) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const orders = await Promise.all(
      user.orders.map(async (order) => {
        const currentTime = moment();
        const ordersEstimatedDeliveryTime = moment(order.deliveryTime, "LLLL");
        const remainingTime = ordersEstimatedDeliveryTime.diff(
          currentTime,
          "minutes"
        );

        const status = currentTime.isSameOrBefore(ordersEstimatedDeliveryTime)
          ? order.status
          : "delivered";

        if (status !== order.status) {
          order.status = status;
          await order.save();
        }

        const message =
          status === "delivered"
            ? "You order has been delivered successfully"
            : `Your order will be delivered in ${remainingTime} minutes`;

        return {
          id: order._id,
          cart: order.cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          orderCreationTime: order.time,
          status,
          message
        };
      })
    );

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
