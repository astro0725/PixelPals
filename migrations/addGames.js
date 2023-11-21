'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rawgId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'The ID of the game from the RAWG.io API'
      },
      imageUrl: {
        type: Sequelize.STRING,
        comment: 'URL of the game cover image'
      },
      firebaseUserId: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The Firebase user ID of the user who added the game'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Games');
  }
};