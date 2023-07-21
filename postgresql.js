require("dotenv").config();
const { Client } = require("pg");
const dbClient = new Client({
  user: "postgres",
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DATABASE,
  password: process.env.POSTGRESQL_PASSWORD,
  port: process.env.POSTGRESQL_PORT,
});

module.exports = dbClient;
