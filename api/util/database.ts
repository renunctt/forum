import { Sequelize } from 'sequelize'

const PG_DB = process.env.PG_DB
const PG_USER = process.env.PG_USER
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_HOST = process.env.PG_HOST

if (!PG_DB || !PG_USER || !PG_PASSWORD || !PG_HOST) {
  throw new Error('Environment variables for PostgreSQL connection are not properly configured.')
}

const db = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  dialect: 'postgres',
})

export default db
