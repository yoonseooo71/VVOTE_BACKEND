require("dotenv").config();
const { Client } = require("pg");
const dbClient = new Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "vvote-app",
  password: "leeys0710@",
  port: 5432,
});

module.exports = dbClient;
