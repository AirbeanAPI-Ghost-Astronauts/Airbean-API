//creating a model for beans

const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"]
    },
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
      default: 0
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      default: 0
    },
    description: {
      type: String,
      required: [true, "Please add a description"]
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("beans", ordersSchema);

module.exports = Order;
