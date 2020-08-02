const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/products");

exports.Products_Get_All = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      if (docs) {
        console.log("docs => " + docs);
        const result = {
          count: docs.length,
          product: docs.map((doc) => {
            return {
              _id: doc._id,
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              request: {
                type: "GET",
                URL: "http://localhost:3000/products/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "No data found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.Products_Create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product created",
        product: result,
        request: {
          type: "GET",
          description: "GO_BACK_TO_PRODUCTS",
          URL: "http://localhost:3000/products/",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.Products_Get_By_Id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        const result = {
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          request: {
            type: "GET",
            description: "GO_BACK_TO_PRODUCTS",
            URL: "http://localhost:3000/products/",
          },
        };
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "No valid entry found " });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.Products_Update_Product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((docs) => {
      res.status(200).json({
        message: "Product details Updated",
        _id: id,
        request: {
          type: "GET",
          description: "GO_TO_PRODUCT",
          URL: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.Products_Delete_Product = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product Deleted",
        _id: id,
        request: {
          type: "GET",
          description: "GET_BACK_TO_PRODUCTS",
          URL: "http://localhost:3000/products/",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
