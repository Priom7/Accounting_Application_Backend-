const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const accountsRoutes = require("./routes/accounts-routes");
const groupsRoutes = require("./routes/groups-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/accounts", accountsRoutes);
app.use("/api/groups", groupsRoutes);

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
