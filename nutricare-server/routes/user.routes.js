module.exports = (app) => {
  const db = require("../models");
  const User = db.user;

  // ✅ POST - save user
  app.post("/api/users", async (req, res) => {
    try {
      const { name, age, weight, gender, conditions } = req.body;

      const newUser = await User.create({
        name,
        age,
        weight,
        gender,
        diabetes: conditions.diabetes || false,
        bp: conditions.bp || false,
        cholesterol: conditions.cholesterol || false,
      });

      res.status(201).json(newUser);
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ✅ GET - fetch all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Error fetching users" });
    }
  });
};
