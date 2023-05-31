const express = require("express");
const router = express.Router();
const moment = require("moment");

const { Order, User, Menu } = require("../models/dataModel");

router.post("/api/beans/orders", async (req, res) => {
  const { userId, cart, guestEmail } = req.body;

  try {
    let user;
    let email;

    if (userId) {
      user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      email = user.email;
    } else if (guestEmail) {
      email = guestEmail;
    } else {
      return res.status(400).json({ error: "Guest email not provided" });
    }
    const drinksId = cart.map((item) => item.id);

    const menu = await Menu.find({ _id: { $in: drinksId } });
    if (menu.length !== drinksId.length) {
      return res.status(400).json({ error: "Coffee not found" });
    }
    const cartItem = cart.map((item) => {
      const menuItem = menu.find((coffee) => coffee._id.toString() === item.id);
      const price = menuItem.price * item.quantity;
      return {
        item: menuItem._id,
        quantity: item.quantity,
        price: price,
        name: menuItem.name
      };
    });
    const totalPrice = cartItem.reduce((acc, item) => acc + item.price, 0);
    const currentTime = moment().local();
    const timeToMakeOrderReady = 10;
    const ordersEstimatedDeliveryTime = moment(currentTime)
      .add(timeToMakeOrderReady, "minutes")
      .format("LLLL");

    const order = new Order({
      cart: cartItem,
      time: currentTime,
      user: userId || null,
      deliveryTime: ordersEstimatedDeliveryTime,
      status: "pending"
    });

    await order.save();

    if (user) {
      user.orders.push(order._id);
      await user.save();
    }

    const orderInfo = {
      customer: {
        email
      },

      "Order Details": { order, orderTotal: totalPrice }
    };
    res.json({
      orderInfo
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
