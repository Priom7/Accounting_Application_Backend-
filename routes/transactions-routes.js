const express = require("express");
const { check } = require("express-validator");

const transactionsControllers = require("../controllers/transactions-controller");

const router = express.Router();

router.get(
  "/:tid",
  transactionsControllers.getTransactionById
);
router.get(
  "/account/:aid",
  transactionsControllers.getTransactionByAccountId
);

router.post("/", transactionsControllers.createTransaction);

module.exports = router;
