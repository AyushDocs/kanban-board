import { Sequelize } from 'sequelize';

const {DB_URL}=process.env;
if (!DB_URL) {
  throw new Error('Database URL is not defined in environment variables');
}
const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;