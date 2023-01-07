const { Sequelize, sequelize } = require(".");

const phoneValidatorRegex = /[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$/;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
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
      allowNull: false,
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
    roles: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  });
  User.associate = function (models) {
    User.hasMany(models.house);
  };
  User.associate = function (models) {
    User.hasMany(models.announce);
  };
  return User;
};
