const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/checkAuth");
const productController = require("../controllers/products");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const fSize = (req, file, cb) => {
  if (file.size < 1024 * 1024 * 5) {
    cb(null, true);
  } else {
    cb(new Error("File Size exceeded"), false);
  }
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("filetype is not valid"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: fSize,
  },
  fileFilter: fileFilter,
});

router.get("/", productController.Products_Get_All);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productController.Products_Create_product
);

router.get("/:productId", checkAuth, productController.Products_Get_By_Id);

router.patch(
  "/:productId",
  checkAuth,
  productController.Products_Update_Product
);

router.delete(
  "/:productId",
  checkAuth,
  productController.Products_Delete_Product
);
module.exports = router;
