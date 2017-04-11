'use strict';
module.exports = function(sequelize, DataTypes) {
  var burger2 = sequelize.define('burger2', {
    burger_name: DataTypes.STRING,
    devoured: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return burger2;
};
