const { Op, fn, col } = require("sequelize");

module.exports = (app) => {
  const db = require("../models");
  const User = db.user;

  // ✅ POST - Create or Update User
  app.post("/api/users", async (req, res) => {
    try {
      const { name, age, weight, gender, conditions } = req.body;

      // Case-insensitive exact match using Sequelize.fn
      const existingUser = await User.findOne({
        where: db.Sequelize.where(
          fn("lower", col("name")),
          name.trim().toLowerCase()
        ),
      });

      console.log("Checking for existing user:", name);
      console.log("Found existing user?", !!existingUser);

      if (existingUser) {
        await existingUser.update({
          age,
          weight,
          gender,
          diabetes: conditions.diabetes || false,
          bp: conditions.bp || false,
          cholesterol: conditions.cholesterol || false,
          goals: req.body.goals || [],
        });

        return res.status(200).json({
          message: "User updated",
          user: existingUser,
        });
      }

      // Else: create new user
      const newUser = await User.create({
        name: name.trim(),
        age,
        weight,
        gender,
        diabetes: conditions.diabetes || false,
        bp: conditions.bp || false,
        cholesterol: conditions.cholesterol || false,
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
};
