const mongoose = require("mongoose");

const transactionScheme = new mongoose.Schema({
  TransactionID: {
    type: String,
    required: true,
    index: true,
  },
  UserID: {
    type: String,
    required: true,
    index: true,
  },
  Amount: {
    type: String,
    required: true,
  },
  Timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model("Transaction", transactionScheme);
