const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoute = require("./api/routes/products");
const orderRoute = require("./api/routes/orders");
const userRoute = require("./api/routes/user");

mongoose.connect(
  "mongodb+srv://node-shop:" +
    "anonymous" +
    "@node-shop.rgsx7.mongodb.net/node-shop-db?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "It works fine ",
//   });
// });
app.use(morgan("dev"));
app.use("/uploads", express.static("./uploads/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/user", userRoute);
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
