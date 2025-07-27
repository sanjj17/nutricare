const express = require("express");
const cors = require("cors");
const db = require("./models");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
db.sequelize.sync().then(() => {
  console.log("Synced DB.");
}).catch((err) => {
  console.error("Failed to sync DB:", err.message);
});

// Routes
require("./routes/user.routes")(app);
require("./routes/auth.routes")(app);


// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
