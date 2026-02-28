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
  const id = Number(req.params.id);

  const [updated] = await Book.update(req.body, {
    where: { id }
  });

  if (!updated) {
    return res.status(404).json({ message: "Book not found" });
  }
  else
  {
    const updatedBook = await Book.findByPk(id);
    return res.status(200).json(updatedBook);
  }
};

exports.find = async (req, res) => { 
  const book = await Book.findByPk(req.params.id); 
  if (!book) { 
    return res.status(404).json({ message: "Book not found" }); 
  } 
  res.json(book); 
};

exports.delete = async (req, res) => {
  const id = Number(req.params.id);

  const deleted = await Book.destroy({
    where: { id }
  });

  if (!deleted) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(204).send(); 
};

exports.datatable = async (req, res) => {
  try {
    const { author, page = 1, limit = 10 } = req.query;

    const where = {};
    if (author) where.author = author;

    const offset = (Number(page) - 1) * Number(limit);

    const rows = await Book.findAll({
      where,
      limit: Number(limit),
      offset,
      order: [["id", "ASC"]],
      raw: true
    });

    return res.status(200).json(rows); // pastikan langsung array
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};
