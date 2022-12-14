const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    operatorAliases: process.env.DB_OPERATORS_ALIASES,
    // dialectOptions: {options: {requestTimeout: 300000}}
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    operatorAliases: process.env.DB_OPERATORS_ALIASES,
    // dialectOptions: {options: {requestTimeout: 300000}}
  }
}