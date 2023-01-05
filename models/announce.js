module.exports = (sequelize, Sequelize) => {
  const Announce = sequelize.define("announce", {
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: true,
    },
  });
  Announce.associate = function (models) {
    Announce.belongsTo(models.proprietary);
  };
  return Announce;
};
