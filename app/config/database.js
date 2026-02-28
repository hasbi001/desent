module.exports = {
  HOST: "mysql-210e9564-alihasbi001-2c23.j.aivencloud.com",
  USER: "avnadmin",
  PASSWORD: "AVNS_czQ0gBA9acWEm7MYTuv",
  DB: "defaultdb",
  dialect: "mysql",
  ssl: {
    ca:"./ca.pem"
  }
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
