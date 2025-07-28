const { Op, fn, col } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  const db = require("../models");
  const User = db.user;

  // ✅ POST - Create or Update User Profile
  app.post("/api/users", async (req, res) => {
    try {
      const { name, email, age, weight, gender, conditions } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        await existingUser.update({
          name: name?.trim() || existingUser.name,
          age,
          weight,
          gender,
          diabetes: conditions?.diabetes || false,
          bp: conditions?.bp || false,
          cholesterol: conditions?.cholesterol || false,
          goals: req.body.goals || [],
        });

        return res.status(200).json({
          message: "User updated",
          user: existingUser,
        });
      }

      // Create new user if not found
      const newUser = await User.create({
        name: name?.trim(),
        email,
        age,
        weight,
        gender,
        diabetes: conditions?.diabetes || false,
        bp: conditions?.bp || false,
        cholesterol: conditions?.cholesterol || false,
        goals: req.body.goals || [],
      });

      return res.status(201).json({
        message: "User created",
        user: newUser,
      });
    } catch (err) {
      console.error("❌ Error in POST /api/users:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ GET - Fetch All Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {
      console.error("❌ Error in GET /api/users:", err);
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // ✅ GET - Fetch single user by email
  app.get("/api/users/:email", async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.params.email } });
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      console.error("❌ Error fetching user:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ POST - Signup
  app.post("/api/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: newUser.id }, "secret_key", { expiresIn: "1d" });

      res.status(201).json({
        message: "Signup successful",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          age: newUser.age || null,
          weight: newUser.weight || null,
          gender: newUser.gender || null,
          diabetes: newUser.diabetes || false,
          bp: newUser.bp || false,
          cholesterol: newUser.cholesterol || false,
          goals: newUser.goals || [],
        },
        token,
      });
    } catch (err) {
      console.error("❌ Error in /api/signup:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ POST - Login
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, "your_jwt_secret", {
        expiresIn: "2h",
      });

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age || null,
          weight: user.weight || null,
          gender: user.gender || null,
          diabetes: user.diabetes || false,
          bp: user.bp || false,
          cholesterol: user.cholesterol || false,
          goals: user.goals || [],
        },
      });
    } catch (err) {
      console.error("❌ Error in /api/login:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
};
