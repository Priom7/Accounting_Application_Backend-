const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const accountsRoutes = require("./routes/accounts-routes");
const groupsRoutes = require("./routes/groups-routes");
const transactionsRoutes = require("./routes/transactions-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// For CORS fix in browser error

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE"
  );
  next();
});

app.use("/api/accounts", accountsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/transactions", transactionsRoutes);

app.use((req, res, next) => {
  const error = new HttpError(
    "Could not find this route.",
    404
  );
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 5000);
  res.json({
    message: error.message || "An unknown error occurred!",
  });
});
