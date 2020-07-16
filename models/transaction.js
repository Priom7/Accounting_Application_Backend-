const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  accountDebited: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
  },
  debitedAccountName: { type: String },
  debitedGroupName: { type: String },
  debitAmount: { type: Number },
  accountCredited: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
  },
  creditedAccountName: { type: String },
  creditedGroupName: { type: String },
  creditAmount: { type: Number },
  narration: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);
