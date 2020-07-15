const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String },
  accounts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

groupSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Group", groupSchema);
