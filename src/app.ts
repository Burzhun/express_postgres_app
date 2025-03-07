import createHttpError from 'http-errors';
import * as express from "express";

import router from './routes/index'

var app = express();
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createHttpError(404));
// });




export default app;
