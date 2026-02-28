const db = require("../models");
const Book = db.book;
const Op = db.Sequelize.Op;
const { body, validationResult } = require("express-validator");

exports.validate = [
  body("title")
    .notEmpty().withMessage("title is required")
    .isString().withMessage("Name must be a string")
    .isLength({ max: 255 }).withMessage("Name max 255 characters"),

  body("author")
    .notEmpty().withMessage("Author is required")
    .isString().withMessage("Author must be a string"),

  body("year")
    .notEmpty().withMessage("Year is required")
    .isNumeric().withMessage("Year must be a number")
];

exports.create = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Book.create(req.body)
  .then(data=>{
       res.status(201).json(data);
  }).catch(err=>{
      res.status(401).json({
        message: err.message || "Error creating book"
      });
  });
};

exports.find = (req, res) => {
    const id = req.params.id;
    
    Book.findByPk(id)
      .then(data => {
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Book with id=${id}.`,
                data: null
            });
        }
      })
      .catch(err => {
            res.status(404).send({
                message: "Error retrieving Book with id=" + id,
                data: null
            });
      });
};

exports.update = (req, res) => {
    const id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({
        message: errors.array(),
        });
    }
    Book.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.status(200).send(req.body);
        } else {
            res.send({
                message: `Cannot update Book with id=${id}. Maybe Product was not found or req.body is empty!`,
                data:null
            });
        }
    })
    .catch(err => {
        res.status(404).send({
            message: "Error updating Book with id=" + id,
            data: null
        });
    });    
};


exports.delete = (req, res) => {
    const id = req.params.id;

    Book.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
        res.send({
            message: "Book was deleted successfully!"
        });
        } else {
        res.send({
            message: `Cannot delete Book with id=${id}. Maybe Book was not found!`
        });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: "Could not delete Book with id=" + id
        });
    });
};

exports.datatable = async (req, res) => {
  try {
    const { author } = req.query;
    var condition={};
   if (author) {
      condition.author = author;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Book.findAll({
      where: condition,
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    res.status(200).json(rows);

  } catch (error) {
    res.status(404).json({
      message: error.message || "Error retrieving books",
    });
  }
};

exports.findAll = (req, res) => {
    
    // const name = req.body.name;
    // logger.writeToLog(name);
    // var condName = name ? { name: { [Op.like]: `%${name}%` } } : null;
    // const sku = req.body.sku;
    // var condSku = sku ? { sku: { [Op.like]: `%${sku}%` } } : null;
    var condition=null;
    
    // if (condName != null || condSku != null) {
    //     condition = {
    //         [Op.or]: [
    //             condName,
    //             condSku
    //         ]
    //     }
    // }

    Book.findAll({ where: condition
        }).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving products."
            });
        });
};
