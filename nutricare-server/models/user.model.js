module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diabetes: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bp: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cholesterol: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return User;
};
