const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const transactionController = require("../Controllers/transactionController");

// Validate for getTop Users

router.get(
  "/top-users",
  [
    body("month").isInt({ min: 1, max: 12 }),
    body("year").isInt({ min: 1996 }), // CHECK FOR YEAR MIN
    body("limit").isInt({ min: 1 }),
  ],
  transactionController.getTopUsers
);

router.get(
  "/highest-trans-hour",
  [body("year").isInt({ min: 1996 })],
  transactionController.getHighestTransHour
);

module.exports = router;
