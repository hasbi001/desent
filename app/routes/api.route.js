const { verify, authJwt  } = require("../middleware");
const auth = require("../controllers/authController");
const home = require("../controllers/homeController");
const book = require("../controllers/bookController");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept, Authorization"
        );
        next();
    });

    app.post("/auth/signup",
        [verify.checkDuplicateUsernameOrEmail, verify.checkRolesExisted],
        auth.signup
    );

    app.post("/auth/signin", auth.signin);
    app.post("/auth/signout", auth.signout);
    
    app.get("/ping", home.ping);

    app.post("/echo", home.echo);

    app.post("/auth/token", auth.generateToken);

    app.get("/books", authJwt.verify, book.datatable);

    app.get("/books/:id", book.find);
    app.post("/books", book.validate,book.create);

    app.put("/books/:id", book.validate ,book.update);
    app.delete("/books/:id", book.delete);
};
