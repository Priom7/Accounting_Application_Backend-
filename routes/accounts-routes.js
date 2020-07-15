const express = require("express");
const { check } = require("express-validator");

const accountsControllers = require("../controllers/accounts-controllers");

const router = express.Router();

router.get("/:aid", accountsControllers.getAccountById);

router.get(
  "/group/:gid",
  accountsControllers.getAccountsByGroupId
);

router.post("/", accountsControllers.createAccount);

module.exports = router;
