const db = require("../models");
const Book = db.book;
const { body, validationResult } = require("express-validator");

exports.validate = [
  body("title").notEmpty().withMessage("title is required"),
  body("author").notEmpty().withMessage("author is required"),
  body("year").notEmpty().withMessage("year is required").isNumeric()
];

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  try {
    const book = await Book.create({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year
    });

    res.status(201).json(book.get({ plain: true })); // ⚡ faster output
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  const [updated] = await Book.update(req.body, {
    where: { id: req.params.id }
  });

  if (!updated) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(req.body);
};

exports.find = async (req, res) => { 
  const book = await Book.findByPk(req.params.id); 
  if (!book) { 
    return res.status(404).json({ message: "Book not found" }); 
  } 
  res.json(book); 
};

exports.delete = async (req, res) => {
  const deleted = await Book.destroy({
    where: { id: req.params.id }
  });

  if (!deleted) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json({ message: "Deleted successfully" });
};

exports.datatable = async (req, res) => {
  try {
    const { author, page = 1, limit = 10 } = req.query;

    const where = {};
    if (author) where.author = author;

    const offset = (page - 1) * limit;

    const rows = await Book.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["id", "ASC"]],
      raw: true   // ⚡ penting: skip Sequelize instance build
    });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};
