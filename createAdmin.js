require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/admin");

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "dinesh@gmail.com";       // You can change this
    const password = "dinesh";              // You can change this

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists.");
    } else {
      await Admin.create({ email, password }); // 👈 no hash here
      console.log("✅ Admin created successfully.");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    mongoose.disconnect();
  }
};

createAdmin();
