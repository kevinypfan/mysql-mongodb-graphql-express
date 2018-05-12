
module.exports = function (sequelize, DataTypes) {
  const Token = sequelize.define('Token', {
    tokenHash: { type: DataTypes.STRING, required: true },
    device: { type: DataTypes.STRING, required: true },
    ip: {
      type: DataTypes.STRING, required: true, validate: {
        isIP: {
          args: true,
          msg: "此需為ipv4 or ipv6"
        }
      }
    }
  });


  Token.associate = (models) => {
    Token.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }

  return Token;
}