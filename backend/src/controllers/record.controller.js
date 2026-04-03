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
      return res.status(400).json({ message: "Insufficient balance" });
    }
  }

  // Create new record
  const record = await Record.create({ ...req.body, userId: req.user.id });
  res.json(record);
};

// Get all records with optional filters
exports.getRecords = async (req, res) => {
  const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      filter.date.$lt = end;
    }
  }

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [{ category: searchRegex }, { notes: searchRegex }];
  }

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNumber - 1) * limitNumber;

  const [records, total] = await Promise.all([
    Record.find(filter).sort({ date: -1 }).skip(skip).limit(limitNumber),
    Record.countDocuments(filter)
  ]);

  res.json({
    data: records,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber)
    }
  });
};

// Update an existing record
exports.updateRecord = async (req, res) => {
  const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(record);
};

// Delete a record
exports.deleteRecord = async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
