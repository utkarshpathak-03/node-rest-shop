const express = require("express");
const User = require("../models/user");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.User_Signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists already",
        });
      } else {
        bycrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User Created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.User_Login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "mail doesn't exists",
        });
      }
      bycrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "password incorrect",
          });
        }
        if (result) {
          const token = jwt.sign(
            { email: user[0].email, _id: user[0]._id },
            "JsonSecret",
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "successfully signed in",
            token: token,
          });
        }
        return res.status(401).json({
          message: "password incorrect",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.User_Get_All = (req, res, next) => {
  User.find()
    .exec()
    .then((results) => {
      console.log(results);
      res.status(200).json({
        count: results.length,
        users: results.map((result) => {
          return {
            _id: result._id,
            email: result.email,
            password: result.password,
          };
        }),
      });
    })
    .catch();
};

exports.User_Delete_user = (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "User Deleted ",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
