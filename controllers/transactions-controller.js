const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Account = require("../models/account");
const Transaction = require("../models/transaction");

const getTransactionById = async (req, res, next) => {
  const transactionId = req.params.tid;

  let transaction;
  try {
    transaction = await Transaction.findById(transactionId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an Transaction.",
      500
    );
    return next(error);
  }

  if (!transaction) {
    const error = new HttpError(
      "Could not find an Transaction for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    transaction: transaction.toObject({ getters: true }),
  });
};

const getTransactionByAccountId = async (
  req,
  res,
  next
) => {
  const accountId = req.params.aid;
  let transactionsDebited;
  let transactionsCredited;
  let account;
  try {
    transactionsDebited = await Transaction.find({
      accountDebited: accountId,
    });
    transactionsCredited = await Transaction.find({
      accountCredited: accountId,
    });
    account = await Account.findOne({ _id: accountId });
  } catch (err) {
    const error = new HttpError(
      "Fetching Transaction failed, please try again later...",
      500
    );
    return next(error);
  }

  res.json({
    transactionsDebited: transactionsDebited.map((debit) =>
      debit.toObject({ getters: true })
    ),
    transactionsCredited: transactionsCredited.map(
      (credit) => credit.toObject({ getters: true })
    ),
    account: account,
  });
};

const createTransaction = async (req, res, next) => {
  const {
    accountDebited,
    debitAmount,
    accountCredited,
    creditAmount,
    narration,
  } = req.body;

  let debitAccount;
  let creditAccount;
  try {
    debitAccount = await Account.findById(accountDebited);
    creditAccount = await Account.findById(accountCredited);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating transaction failed, please try again",
      500
    );
    return next(error);
  }

  if (!debitAccount || !creditAccount) {
    const error = new HttpError(
      "Could not find account for provided id",
      404
    );
    return next(error);
  }
  console.log(debitAccount.name, creditAccount.name);

  const createdTransaction = new Transaction({
    accountDebited,
    debitedAccountName: debitAccount.name,
    debitedGroupName: debitAccount.groupName,
    debitAmount,
    accountCredited,
    creditedAccountName: creditAccount.name,
    creditedGroupName: creditAccount.groupName,
    creditAmount,
    narration,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTransaction.save({ session: sess });
    creditAccount.transactions.push(createdTransaction);
    await creditAccount.save({ session: sess });
    debitAccount.transactions.push(createdTransaction);
    await debitAccount.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating Transaction failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ transaction: createdTransaction });
};

exports.createTransaction = createTransaction;
exports.getTransactionById = getTransactionById;
exports.getTransactionByAccountId = getTransactionByAccountId;
