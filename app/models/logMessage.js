"use strict";

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "LogMessage",
    // Fields
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      from: DataTypes.STRING,
      type: DataTypes.STRING,
      text: DataTypes.STRING,
      body: DataTypes.STRING,
    },
    // Model options
    {
      tableName: "log_message",
      timestamps: false,
    }
  );
};
