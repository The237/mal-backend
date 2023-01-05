const { Sequelize, sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const Applicant_House = sequelize.define("Applicant_House", {
    houseId: {
      type: Sequelize.INTEGER,
    },
    applicantId: {
      type: Sequelize.INTEGER,
    },
  });
  Applicant_House.associate = (models) => {
    Applicant_House.belongsTo(models.applicant, {
      foreignKey: "applicantId",
    });
    Applicant_House.belongsTo(models.house, {
      foreignKey: "houseId",
    });
  };
  return Applicant_House;
};
