const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const authRoutes = require("./features/auth/auth.routes");
const usersRoutes = require("./features/users/users.routes");
const servicesRoutes = require("./features/services/services.routes");
const ordersRoutes = require("./features/orders/orders.routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/orders", ordersRoutes);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.use(errorHandler);

module.exports = app;
