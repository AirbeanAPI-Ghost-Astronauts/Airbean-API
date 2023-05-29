const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//step 4 importing product model.
const Orders = require("./models/orderModel.js");
const User = require("./models/userModel.js");
const Menu = require("./models/menuModel.js");

const app = express();
//step3  middleware so we can access the json body
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello, API works fine :)");
});

//loading the menu from Mongodb, if the menu is empty, it will load the data from the json file and then json file will be uploaded to mongoDB
app.get("/api/beans", async (req, res) => {
  try {
    let menu = await Menu.find();
    if (menu.length === 0) {
      const data = require("./data/menu.json");
      menu = await Menu.insertMany(data);
    }

    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/beans/order", async (req, res) => {
  try {
    const order = await Orders.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.log(error);
  }
});

// Create a new user
app.post("/api/user/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({ username, password: hashedPassword });

    // Save the user to the database
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// User login
app.post("/api/user/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 5000;

// creating mongoose connection
const run = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://shahin:admin123@cluster0.v66pylg.mongodb.net/?retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("Connected to database!!!");
      });
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

run();
