const { max } = require("underscore");
const { Sequelize, sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const House = sequelize.define("house", {
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        min: 10,
        max: 500,
      },
    },
    superficie: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    adresse: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        min: 10,
        max: 150,
      },
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    categorie: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    prix: {
      type: Sequelize.BIGINT,
      allowNull: false,
      validate: {
        min: 5000,
      },
    },
    parking: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    cloture: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    region: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    departement: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 58,
      },
    },
    arrondissement: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 361,
      },
    },
    quartier: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lieuDit: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    nbMoisDde: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    images: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    pieces: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false,
    },
  });
  House.associate = function (models) {
    House.belongsTo(models.user);
  };
  return House;
};
