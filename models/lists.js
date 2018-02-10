module.exports = function (sequelize, DataTypes) {
  var lists = sequelize.define("lists", {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 140] }
    },
    phone:{
      type: DataTypes.STRING
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { len: [1] }
    },
    departure: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 140] }
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 140] }
    },    
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { len: [1] }
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1] }
    },
    currentSeats:{
      type: DataTypes.INTEGER
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { len: [1, 10] }
    },
    isFull: {
      type: DataTypes.BOOLEAN
    },
    minMoney: {
      type: DataTypes.STRING,
      validate: { isNumeric: true }
    }
  });
  freezeTableName: true


  return lists;
};
