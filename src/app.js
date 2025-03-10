"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var index_1 = require("./routes/index");
var app = express();
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', index_1.default);
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createHttpError(404));
// });
exports.default = app;
