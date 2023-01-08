const { Sequelize, sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const User_House = sequelize.define("user_house", {
    houseId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  });
  User_House.associate = (models) => {
    User_House.belongsTo(models.user, {
      foreignKey: "userId",
    });
    User_House.belongsTo(models.house, {
      foreignKey: "houseId",
    });
  };
  return User_House;
};
