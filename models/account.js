const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name: { type: String },
  inGroup: {
    type: mongoose.Types.ObjectId,
    ref: "Group",
  },
  groupName: { type: String },
  transactions: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Account", accountSchema);
