const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { name, email, age, address, phone } = req.body;
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      name,
      email,
      age,
      address,
      phone,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

  const getUserByField = async (req, res) => {
    try {
      const { name, email, age, address, phone } = req.query;
  
      let query = {};
      if (name) query.name = name;
      if (email) query.email = email;
      if (age) query.age = age;
      if (address) query.address = address;
      if (phone) query.phone = phone;
  
      const user = await User.findOne(query);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  const updateUser = async (req, res) => {
    try {
      const { name, email, age, address, phone } = req.body;
      const userId = req.params.id;
  
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      user.age = age || user.age;
      user.address = address || user.address;
      user.phone = phone || user.phone;
  
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
module.exports = { createUser, getAllUsers, getUserByField, updateUser, deleteUser  };
