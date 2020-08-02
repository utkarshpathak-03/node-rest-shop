const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/list", userController.User_Get_All);

router.post("/signup", userController.User_Signup);

router.post("/login", userController.User_Login);

router.delete("/:userId", userController.User_Delete_user);

module.exports = router;
