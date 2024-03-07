import { Model, QueryInterface, DataTypes } from 'sequelize';

export default {
    up(queryInterface: QueryInterface) {
        return queryInterface.addConstraint('users', {
            fields: ['email'],
            type: 'unique',
            name: 'unique_email_constraint'
        })
    },

    down(queryInterface: QueryInterface) {
        return queryInterface.removeConstraint('users', 'unique_email_constraint')
    }
}