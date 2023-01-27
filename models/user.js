const { Sequelize, sequelize } = require(".");

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
      type: Sequelize.ENUM("Masculin", "Féminin"),
      defaultValue: "Masculin",
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
    adresse: {
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
    role: {
      type: Sequelize.ENUM("tenant", "landlord", "admin", "superadmin"),
      defaultValue: "tenant",
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
