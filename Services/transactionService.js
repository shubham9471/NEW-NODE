const Transaction = require("../Model/transaction");
const cache = require("./cache");

async function getTopUsers(month, year, limit) {
  const cacheKey = `topUsers_${month}_${year}_${limit}`;
  const cacheResult = cache.get(cacheKey);

  if (cacheResult) {
    console.log("INNNN++++");
    return cacheResult;
  } else {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

    try {
      const topUsers = await Transaction.aggregate([
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
            totalAmount: {
              $sum: "$Amount",
            },
          },
        },
        {
          $project: {
            _id: 0,
            UserID: "$_id",
            totalAmount: 1,
          },
        },
        {
          $sort: {
            totalAmount: -1,
          },
        },
        {
          $limit: limit,
        },
      ])
        .allowDiskUse(true)
        .exec();

      cache.set(cacheKey, topUsers);
      return topUsers;
    } catch (err) {
      throw err;
    }
  }
}

async function getHighestTransHour(year) {
  const cacheKey = `getHighestTransHour${year}`;
  const cacheResult = cache.get(cacheKey);
  if (cacheResult) {
    return cacheResult;
  } else {
    const startDate = new Date(year, 0, 1).toISOString(); // First day of the year
    const endDate = new Date(year + 1, 0, 0).toISOString(); // Last day of the given year
    try {
      const result = await Transaction.aggregate([
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
              month: { $month: { $toDate: "$Timestamp" } }, // Convert string to date
              day: { $dayOfMonth: { $toDate: "$Timestamp" } }, // Convert string to date
              hour: { $hour: { $toDate: "$Timestamp" } }, // Convert string to date
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $group: {
            _id: {
              month: "$_id.month",
            },
            highestTransHour: {
              $first: "$_id",
            },
            totalTransactions: {
              $first: "$count",
            },
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
      ])
        .allowDiskUse(true)
        .exec();
      cache.set(cacheKey, result);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  getTopUsers,
  getHighestTransHour,
};
