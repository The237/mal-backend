const { Sequelize, sequelize } = require(".");

const phoneValidatorRegex = /(^222\d{6}$|^6[5-9]{1}\d{7}$)/;

module.exports = (sequelize, Sequelize) => {
  const Proprietary = sequelize.define("proprietary", {
    nom: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        min: 3,
        max: 50,
      },
    },
    prenom: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        min: 0,
        max: 50,
      },
    },
    sexe: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    telephone: {
      type: Sequelize.STRING,
      validate: {
        min: 9,
        max: 9,
        validator: function (v) {
          return phoneValidatorRegex.test(v);
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
      unique: {
        args: true,
        msg: "Email adress already in use !",
      },
    },
    adress: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        min: 0,
        max: 50,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  Proprietary.associate = function (models) {
    Proprietary.hasMany(models.house);
  };
  Proprietary.associate = function (models) {
    Proprietary.hasMany(models.announce);
  };
  return Proprietary;
};
