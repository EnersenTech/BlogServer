const Sequelize = require('sequelize')
module.exports = class SUB_CATEGORY extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        ID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        NAME: {
            type: Sequelize.STRING,
            allowNull: false
        },
        CATEGORY_ID: {
            type: Sequelize.INTEGER,
            foreignKey: true,
            defaultValue: 0
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'SUB_CATEGORY',
        tableName: 'SUB_CATEGORY',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
  static associate(db) {
    db.SUB_CATEGORY.belongsTo(db.CATEGORY, {
      foreignKey: {name: 'CATEGORY_ID', allowNull: false},
    })
  }
}