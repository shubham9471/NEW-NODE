const { validationResult } = require("express-validator");
const transactionService = require("../Services/transactionService");

const getTopUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { month, year, limit } = req.body;

  try {
    const result = await transactionService.getTopUsers(month, year, limit);
    res.status(200).json(result);
  } catch (err) {
    console.log("Err in getTopUsers-->", err);
    res.status(500).json({ message: err.message });
  }
};

const getHighestTransHour = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const year = req.body.year;
  try {
    const data = await transactionService.getHighestTransHour(year);
    res.json(data);
  } catch (err) {
    console.error(`Error in getHighestTransHour --> ${err}`);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTopUsers,
  getHighestTransHour,
};
