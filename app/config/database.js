const fs = require("fs");

module.exports = {
  HOST: "mysql-210e9564-alihasbi001-2c23.j.aivencloud.com",
  PORT: 24710, 
  USER: "avnadmin",
  PASSWORD: "PASSWORD_KAMU",
  DB: "defaultdb",
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: fs.readFileSync("./app/config/ca.pem")
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
};
