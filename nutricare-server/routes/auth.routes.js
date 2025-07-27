const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user; // we're using the same User model
const SECRET_KEY = "nutricare-secret-key"; // you can move this to .env later

module.exports = (app) => {
  // 🟩 SIGNUP
  app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword });

      return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ message: "Server error during signup" });
    }
  });

  // 🟦 LOGIN
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "2h" });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error during login" });
    }
  });
};
