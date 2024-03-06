import { Model, QueryInterface, DataTypes } from 'sequelize';
import { IMatche } from '../../interfaces/matches/IMatche';

export default {
    up(queryInterface: QueryInterface) {
        return queryInterface.createTable<Model<IMatche>>('matches', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            homeTeamId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'home_team_id',
                references: {
                    key: 'id',
                    model: 'teams'
                }
            },
            homeTeamGoals: {
                type: DataTypes.INTEGER,
                field: 'home_team_goals'
            },
            awayTeamId: {
                type: DataTypes.INTEGER,
                field: 'away_team_id',
                references: {
                    key: 'id',
                    model: 'teams'
                }
            },
            awayTeamGoals: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'away_team_goals'
            },
            inProgress: {
                type: DataTypes.BOOLEAN,
                field: 'in_progress'
            }
        })
    },

    down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('matches');
    }
}