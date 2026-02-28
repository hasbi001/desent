const db = require("../models");
const Book = db.book;
const { body, validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const { title, author, year } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json([{ message: "title is required" }]);
  }
  if (!author || typeof author !== 'string' || author.trim() === '') {
    return res.status(400).json([{ message: "author is required" }]);
  }
  if (!year || typeof year !== 'number' || !Number.isInteger(year)) {
    return res.status(400).json([{ message: "year is required and must be a number" }]);
  }
  
  next();
};

exports.create = (req, res) => {
  
    Book.create({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year
    }, {
      validate: false,      
      hooks: false,       
      logging: false        
    })
    .then(book => {
      res.status(201).json(book);
    })
    .catch(err => {
      res.status(401).json({ message: err.message });
    });
};

exports.update = async (req, res) => {

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
    // ambil query & pastikan tipe number
    const author = req.query.author || null;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const offset = (page - 1) * limit;

    // filter exact match sesuai requirement tester
    const where = {};
    if (author) {
      where.author = author;
    }

    const books = await Book.findAll({
      where,
      limit,
      offset,
      order: [["id", "ASC"]],
      raw: true,      // ⚡ return plain object
      logging: false  // ⚡ speed boost
    });

    return res.status(200).json(books || []);

  } catch (err) {
    console.error(err);
    return res.status(500).json([]);
  }
};

exports.findAll = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};
