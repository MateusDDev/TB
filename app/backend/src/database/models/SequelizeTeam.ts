import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import SequelizeMatch from './SequelizeMatch';

class SequelizeTeam extends Model<
InferAttributes<SequelizeTeam>, InferCreationAttributes<SequelizeTeam>
> {
  declare id: CreationOptional<number>;

  declare teamName: string;
}

SequelizeTeam.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
  underscored: true,
});

SequelizeMatch.belongsTo(SequelizeTeam, {
  foreignKey: 'homeTeamId',
  as: 'homeTeam',
});

SequelizeMatch.belongsTo(SequelizeTeam, {
  foreignKey: 'awayTeamId',
  as: 'awayTeam',
});

SequelizeTeam.hasMany(SequelizeMatch, {
  foreignKey: 'homeTeamId',
  as: 'homeMatches',
});

SequelizeTeam.hasMany(SequelizeMatch, {
  foreignKey: 'awayTeamId',
  as: 'awayMatches',
});

export default SequelizeTeam;
