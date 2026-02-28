const db = require("../models");
const Book = db.book;
const Op = db.Sequelize.Op;
const { body, validationResult } = require("express-validator");

exports.validate = [
  body("title")
    .notEmpty().withMessage("title is required")
    .isString().withMessage("Name must be a string")
    .isLength({ max: 255 }).withMessage("Name max 255 characters"),

  body("description")
    .isString().withMessage("SKU must be a string"),

  body("author")
    .notEmpty().withMessage("Author is required")
    .isString().withMessage("Author must be a string"),

  body("publication_year")
    .notEmpty().withMessage("Publication year is required")
    .isNumeric().withMessage("Publication year must be a number")
];

exports.create = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({
        message: errors.array(),
        });
    }

    const data = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        publication_year: req.body.publication_year
    };

    Book.create(data)
    .then(data => {
      res.status(200).send({
        message: "Success",
        data:data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Product."
      });
    });
};

exports.find = (req, res) => {
    const id = req.params.id;
    
    Book.findByPk(id)
      .then(data => {
        if (data) {
            res.status(200).send({
                message: "Data has been created",
                data:data
            });
        } else {
            res.status(404).send({
                message: `Cannot find Book with id=${id}.`,
                data: null
            });
        }
      })
      .catch(err => {
            res.status(500).send({
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
            res.status(200).send({
                message: "Book was updated successfully",
                data: req.body
            });
        } else {
            res.send({
                message: `Cannot update Book with id=${id}. Maybe Product was not found or req.body is empty!`,
                data:null
            });
        }
    })
    .catch(err => {
        res.status(500).send({
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
        const title = req.query.title;
        var condTitle = title ? { title: { [Op.like]: `%${title}%` } } : null;
        const description = req.query.description;
        var condDesc = description ? { description: { [Op.like]: `%${description}%` } } : null;
        const author = req.query.author;
        var condAuthor = author ? { author: { [Op.like]: `%${author}%` } } : null;
        const publicationYear = req.query.publication_year;
        var condYear = publicationYear ? { publication_year: { [Op.like]: `%${publicationYear}%` } } : null;
        
        var condition=null;
        if (condTitle != null || condDesc != null || condAuthor != null || condYear != null) {
            condition = {
                [Op.or]: [
                    condTitle,
                    condDesc,
                    condAuthor,
                    condYear
                ]
            }
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Book.findAndCountAll({
            where: condition,
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]],
            logging: console.log,
        });

        res.status(200).json({
            success: true,
            message: "List Data Buku",
            data: rows,
            meta: {
                total: count,
                per_page: limit,
                current_page: page,
                last_page: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error retrieving books",
        });
    }
}