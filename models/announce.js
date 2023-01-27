module.exports = (sequelize, Sequelize) => {
  const Announce = sequelize.define("announce", {
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
  Announce.associate = function (models) {
    Announce.belongsTo(models.user);
  };
  return Announce;
};
