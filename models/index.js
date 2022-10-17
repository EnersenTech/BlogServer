const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
console.log(typeof env)
console.log('------------------')
const config = require('./config')[env]
console.log(config.database)

// POST
const POST = require('./post')


// CATEGORY
const CATEGORY = require('./category')

// SUB_CATEGORY
const SUB_CATEGORY = require('./sub_category')


const db = {}
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
)

fs.readdirSync(__dirname).forEach((model) => {
    if (['index.js', '_migrations'].indexOf(model) !== -1) return
    const modelFilePath = path.join(__dirname, model, 'index.js')
    if (fs.existsSync(modelFilePath) && fs.lstatSync(modelFilePath).isFile()) {
      model = require(modelFilePath)(sequelize, DataTypes)
      db[model.name] = model
    }
  })

Object.keys(db).forEach((modelName) => {
if ('associate' in db[modelName]) {
    db[modelName].associate(db)
}
})

db.sequelize = sequelize

db.POST = POST
db.CATEGORY = CATEGORY
db.SUB_CATEGORY = SUB_CATEGORY

POST.init(sequelize)
CATEGORY.init(sequelize)
SUB_CATEGORY.init(sequelize)

CATEGORY.hasOne(SUB_CATEGORY, {
  foreignKey: {name: 'CATEGORY_ID', allowNull: false},
  onDelete: 'cascade'
})



module.exports = db

