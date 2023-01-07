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
    },
    parking: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    region: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    departement: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    arrondissement: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quartier: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lieuDit: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cloture: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nbMoisDde: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    images: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    pieces: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  });
  House.associate = function (models) {
    House.belongsTo(models.user);
  };
  return House;
};
