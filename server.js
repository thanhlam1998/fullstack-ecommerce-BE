const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
// import routes

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(cors());

// Routes
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);

// db
mongoose
  .connect(process.env.ENV_DATABASE || "")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERR", err));

// route
app.get("/api", (req, res) => res.json({ data: "You enter backend" }));

// port
const port = process.env.ENV_PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
