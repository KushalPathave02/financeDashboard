const Record = require("../models/record.model");

exports.getSummary = async (req, res) => {
  const income = await Record.aggregate([
    { $match: { type: "income" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const expense = await Record.aggregate([
    { $match: { type: "expense" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const categoryData = await Record.aggregate([
    { $group: { _id: "$category", total: { $sum: "$amount" }, type: { $first: "$type" } } }
  ]);

  const recentActivity = await Record.find().sort({ date: -1 }).limit(5);

  const monthlyTrends = await Record.aggregate([
    {
      $group: {
        _id: { $month: "$date" },
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
        }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  res.json({
    totalIncome: income[0]?.total || 0,
    totalExpense: expense[0]?.total || 0,
    netBalance: (income[0]?.total || 0) - (expense[0]?.total || 0),
    categoryData,
    recentActivity,
    monthlyTrends
  });
};
