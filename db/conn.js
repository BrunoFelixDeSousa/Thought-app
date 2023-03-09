const { Sequelize } = require('sequelize')
const dotenv = require('dotenv/config')

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host:dbHost,
    dialect: "mysql"
})

try {
    sequelize.authenticate()
    console.log('Conectado ao banco MySql')
} catch (err) {
    console.log(`Não foi possivel conectar: ${err}`)
}

module.exports = sequelize