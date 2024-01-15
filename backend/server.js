const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/ErrorMiddleware");

// Defining port
const port = process.env.PORT || 6000;

// Connect to database
connectDB();

// Create an instance of express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use Api routes
app.use("/api/goals", require("./Routes/goalRoutes"));
app.use("/api/users", require("./Routes/userRoutes"));

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);

// Listen on port
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
