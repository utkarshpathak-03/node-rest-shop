const express = require("express");
const Orders = require("../models/orders");
const Products = require("../models/products");
const mongoose = require("mongoose");

exports.Orders_Get_All = (req, res, next) => {
  Orders.find()
    .select("_id quantity productId")
    .populate("productId", "name price")
    .exec()
    .then((docs) => {
      if (docs) {
        const result = {
          count: docs.length,
          order: docs.map((doc) => {
            return {
              _id: doc._id,
              productId: doc.productId,
              quantity: doc.quantity,
              request: {
                type: "GET",
                URL: "http://localhost:3000/orders/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(result);
      } else {
        res.status(404).jsom({
          message: "data not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).jsom({
        message: "data not found",
      });
    });
};

exports.Orders_Create_order = (req, res, next) => {
  Products.findById(req.body.productId)
    .exec()
    .then((response) => {
      console.log("productId =" + response.productId);
      const order = new Orders({
        _id: mongoose.Types.ObjectId(),
        productId: req.body.productId,
        quantity: req.body.quantity,
      });
      order
        .save()
        .then((result) => {
          res.status(201).json({
            message: "Order has been placed Successfuly",
            order: {
              _id: result._id,
              productId: result.productId,
              quantity: result.quantity,
              request: {
                type: "GET",
                description: "GET_BACK_TO_PRODUCTS",
                URL: "http://localhost:3000/orders",
              },
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Order cannot be Placed as productId is missing or invalid",
      });
    });
};

exports.Orders_Get_By_Id = (req, res, next) => {
  const id = req.params.orderId;
  Orders.findById(id)
    .select("_id productId quantity")
    .populate("productId", "name price")
    .exec()
    .then((doc) => {
      if (doc) {
        const result = {
          _id: doc._id,
          productId: doc.productId,
          quantity: doc.quantity,
          request: {
            type: "GET",
            descriptiom: "GO_TO_ORDERS",
            URL: "http://localhost:3000/orders/",
          },
        };
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "No data found",
        });
      }
    })
    .catch();
};

exports.Orders_Delete_Order = (req, res, next) => {
  const id = req.params.orderId;
  Orders.remove({ _id: id })
    .exec()
    .then((response) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "GET",
          descriptiom: "GO_TO_ORDERS",
          URL: "http://localhost:3000/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "something went wrong",
      });
    });
};
