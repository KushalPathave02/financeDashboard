const Record = require("../models/record.model");

exports.createRecord = async (req, res) => {
  const { amount, type } = req.body;

  if (type === "expense") {
    const income = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expense = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    if (amount > balance) {
      return res.status(400).json({ message: "Insufficient balance ❌" });
    }
  }

  const record = await Record.create({ ...req.body, userId: req.user.id });
  res.json(record);
};

exports.getRecords = async (req, res) => {
  const { type, category } = req.query;

  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;

  const records = await Record.find(filter);
  res.json(records);
};

exports.updateRecord = async (req, res) => {
  const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(record);
};

exports.deleteRecord = async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
