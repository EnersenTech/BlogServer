const Sequelize = require('sequelize')
module.exports = class CATEGORY extends Sequelize.Model {
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
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'CATEGORY',
        tableName: 'CATEGORY',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
  // static associate(db) {
  //   db.CATEGORY.belongsTo(db.POST, {
  //     foreignKey: {name: 'ID', allowNull: false},
  //   })
  // }
}