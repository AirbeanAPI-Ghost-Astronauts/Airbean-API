const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a coffee from the menu !!"],
    },
    quantity: {
      type: Number,
      required: [true, "Please add the quantity"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Check the price"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },
    estimatedDeliveryTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", ordersSchema);

module.exports = Order;
