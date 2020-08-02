const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const ordersControllers = require("../controllers/orders");

router.get("/", checkAuth, ordersControllers.Orders_Get_All);

router.post("/", checkAuth, ordersControllers.Orders_Create_order);

router.get("/:orderId", checkAuth, ordersControllers.Orders_Get_By_Id);

router.delete("/:orderId", checkAuth, ordersControllers.Orders_Delete_Order);

module.exports = router;
