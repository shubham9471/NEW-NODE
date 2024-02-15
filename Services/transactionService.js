const Transaction = require("../Model/transaction");
const cache = require("./cache");

function getTopUsers(month, year, limit, callback) {
  const cacheKey = `topUsers_${month}_${year}_${limit}`;
  const cacheResult = cache.get(cacheKey);
  if (cacheResult) {
    callback(null, cacheResult);
  } else {
    const startDate = new Date(year, month - 1, 1); // Months are zero-based so we need to subtract one from the given value.
    const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the given year
    console.log("INNNNNN HERERRRE", startDate, endDate);

    Transaction.aggregate(
      [
        {
          $match: {
            Timestamp: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$UserID",
            totalAmount: { $sum: "$Amount" },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
        {
          $limit: limit,
        },
      ],
      (err, topUsers) => {
        if (err) {
          callback(err);
        } else {
          cache.set(cacheKey, topUsers);
          callback(null, topUsers);
        }
      }
    );
  }
}

function getHighestTransHour(year, callback) {
  const cacheKey = `getHighestTransHour${year}`;
  const cacheResult = cache.get(cacheKey);
  if (cacheResult) {
    callback(null, cacheResult);
  } else {
    const startDate = new Date(year, 0, 1); // First  day of the year
    const endDate = new Date(year + 1, 0, 0); // Last day of the given year
    console.log("INNNNNN HERERRRE", startDate, endDate);
    Transaction.aggregate(
      [
        {
          $match: {
            Timestamp: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$Timestamp" },
              day: { $dayOfMonth: "$Timestamp" },
              hour: { $hour: "$Timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $group: {
            _id: { month: "$_id.month" },
            highestTransHour: { $first: "$_id" },
            totalTransactions: { $first: "$count" },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            highestTransHour: 1,
            totalTransactions: 1,
          },
        },
      ],
      (err, result) => {
        if (err) {
          callback(err);
        } else {
          cache.set(cacheKey, result);
          callback(null, result);
        }
      }
    );
  }
}

module.exports = {
  getTopUsers,
  getHighestTransHour,
};
