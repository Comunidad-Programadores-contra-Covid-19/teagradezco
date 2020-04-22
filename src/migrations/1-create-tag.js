'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tag', {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      name: {type: Sequelize.TEXT, allowNull: false},
      description: {type: Sequelize.TEXT, allowNull: false},
      createdAt: {allowNull: false, type: Sequelize.DATE},
      updatedAt: {allowNull: false, type: Sequelize.DATE}
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tag',{});
  }
};