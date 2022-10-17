const Sequelize = require('sequelize')
module.exports = class POST extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        ID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        TITLE: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        THUMBNAIL: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        CATEGORY_ID: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        AUTHOR: {
          type: Sequelize.STRING,
          allowNull: false
      },
      TAG: {
          type: Sequelize.STRING,
          allowNull: true
      },
      CONTENT_TEXT: {
          type: Sequelize.TEXT,
          allowNull: false
      },
      SUB_CATEGORY_ID: {
          type: Sequelize.INTEGER,
          allowNull: false
      }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'POST',
        tableName: 'POST',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
}