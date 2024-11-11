const express = require("express");
const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");

// Define index route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
