"use strict";

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Token",
    // Fields
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token_id: DataTypes.STRING,
      phone: DataTypes.STRING,
      type: DataTypes.STRING,
      wa_browser_id: DataTypes.STRING,
      wa_secret_bundle: DataTypes.STRING,
      wa_token_1: DataTypes.STRING,
      wa_token_2: DataTypes.STRING,
    },
    // Model options
    {
      tableName: "tokens",
      timestamps: false,
    }
  );
};
