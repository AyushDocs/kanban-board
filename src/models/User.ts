
import { DataTypes } from 'sequelize';
import sequelize from '@/lib/sequelize';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  }
});

export default User;
