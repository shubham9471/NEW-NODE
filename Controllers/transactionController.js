const { validationResult } = require("express-validator");
const transactionService = require("../Services/transactionService");

const getTopUsers = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { month, year, limit } = req.body;
  console.log("MONTH< YR===>", month, year, limit);
  transactionService.getTopUsers(month, year, limit, (err, result) => {
    if (err) {
      console.log("Err in getTopUsers-->", err);
      return res.status(500).json({ message: err.message });
    }
    //console.log("RES====>", res);
    res.status(200).json(result);
  });
};

const getHighestTransHour = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const year = req.body.year;
  transactionService.getHighestTransHour(year, (err, data) => {
    if (err) {
      console.error(`Error in getHighestTransHour --> ${err}`);
      return res.status(500).json({ message: err.message });
    }
    res.json(data);
  });
};

module.exports = {
  getTopUsers,
  getHighestTransHour,
};
