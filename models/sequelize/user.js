const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "信箱格式有誤！"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        len: {
          args: [6, 100],
          msg: "密碼必須超過六到一百字元！"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "用戶名必須為字元與數字！"
        },
        len: {
          args: [2, 25],
          msg: "用戶名長度必須於2到25之間！"
        }
      }
    }
  }, {
      hooks: {
        afterValidate: async (user) => {

          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.password = hashedPassword;
        }
      }
    });

  User.prototype.authenticate = function (password) {
    return bcrypt.compare(password, this.password).then(result => {
      return result;
    })
  };


  User.associate = (models) => {
    User.hasMany(models.Token, { as: 'tokens', foreignKey: 'userId' });
  }

  return User;
}