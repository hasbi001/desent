const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "desent-session",
    keys: ["eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5MzA2ODI1OSwiaWF0IjoxNjkzMDY4MjU5fQ.iiaX_sI75bOzQqx6x-mPNRAj2TF5X4_N8Lxd35Q47zI"], 
    httpOnly: true,
  })
);

const db = require("./app/models");
const Role = db.role;

db.sequelize.authenticate()
  .then(() => console.log("DB connected"));

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
   initial();
});

//inisiate role
function initial() {
  Role.create({
    id: 1,
    name: "admin"
  });
 
  Role.create({
    id: 2,
    name: "guest"
  });
}

require('./app/routes/api.route')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
