import sequelize from '@/lib/sequelize';

export default async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
  } catch (err) {
    console.error('❌ DB init error:', err);
  }
}
