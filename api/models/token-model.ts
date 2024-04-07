import { DataTypes } from 'sequelize'
import db from '../util/database'

const TokenModel = db.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

export default TokenModel
