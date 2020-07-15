const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Account = require("../models/account");
const Group = require("../models/group");

const getAccountById = async (req, res, next) => {
  const accountId = req.params.pid;

  let account;
  try {
    account = await Account.findById(accountId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an Account.",
      500
    );
    return next(error);
  }

  if (!account) {
    const error = new HttpError(
      "Could not find an Account for the provided id.",
      404
    );
    return next(error);
  }

  res.json({
    account: account.toObject({ getters: true }),
  });
};

const getAccountsByGroupId = async (req, res, next) => {
  const groupId = req.params.uid;

  let groupWithAccounts;
  try {
    groupWithAccounts = await Group.findById(
      groupId
    ).populate("inGroup");
  } catch (err) {
    const error = new HttpError(
      "Fetching Accounts failed, please try again later",
      500
    );
    return next(error);
  }

  if (
    !groupWithAccounts ||
    groupWithAccounts.inGroup.length === 0
  ) {
    return next(
      new HttpError(
        "Could not find Accounts for the provided Group id.",
        404
      )
    );
  }

  res.json({
    accounts: groupWithAccounts.accounts.map((account) =>
      account.toObject({ getters: true })
    ),
  });
};

const createAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check your data.",
        422
      )
    );
  }

  const { name, inGroup } = req.body;

  const createdAccount = new Account({
    name,
    inGroup,
  });

  let group;
  try {
    group = await Group.findById(inGroup);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      " here Creating account failed, please try again",
      500
    );
    return next(error);
  }

  if (!group) {
    const error = new HttpError(
      "Could not find group for provided id",
      404
    );
    return next(error);
  }

  console.log(group);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdAccount.save({ session: sess });
    group.accounts.push(createdAccount);
    await group.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating account failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ account: createdAccount });
};

(exports.createAccount = createAccount),
  (exports.getAccountById = getAccountById),
  (exports.getAccountsByGroupId = getAccountsByGroupId);
