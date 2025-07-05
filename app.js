require("dotenv").config();
require("./config/db")();
require("./utils/cpuMonitor")();

const express = require("express");
const path = require("path");

const globalErrorHandler = require("./middlewares/globalErrorHandler");
const CustomError = require("./utils/CustomError");

const uploadRoutes = require("./routes/upload.route");
const policyRoutes = require("./routes/policy.routes");
const messageRoutes = require("./routes/message.routes");

const { scheduleAllMessages } = require("./utils/scheduler");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/upload", uploadRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/message", messageRoutes);

app.all("*wildcard", (req, res, next) => {
  const message =
    process.env.MODE === "development"
      ? `URL not found: ${req.originalUrl}`
      : "Something went wrong";
  next(new CustomError(message, 404));
});

// add routes here for global error handler
app.use(globalErrorHandler);

// Reschedule pending messages
scheduleAllMessages();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
