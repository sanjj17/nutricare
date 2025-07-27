module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     email: { // 🆕 Added email
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: { // 🆕 Added password
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
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
    goals: {
      type: DataTypes.JSON, // ✅ store array of selected goals
      defaultValue: [],
    }
  });

  return User;
};
