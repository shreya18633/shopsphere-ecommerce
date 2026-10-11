const { Sequelize } = require('sequelize');
const path = require('path');

const isPostgres = process.env.DB_DIALECT === 'postgres' || Boolean(process.env.DB_HOST);

let sequelize;

if (isPostgres) {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'devops_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
} else {
  // SQLite fallback for standalone zero-dependency local runs and quick testing
  const storagePath = process.env.SQLITE_STORAGE || path.join(__dirname, '../../devflow.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    if (sequelize.getDialect() === 'sqlite') {
      await sequelize.sync();
    } else {
      await sequelize.sync({ alter: true });
    }
    console.log('[Database] Models synchronized.');
  } catch (error) {
    console.error('[Database] Connection failed:', error.message);
    // If PostgreSQL fails, fallback gracefully to SQLite so server doesn't crash
    if (isPostgres) {
      console.warn('[Database] Retrying connection with embedded SQLite fallback...');
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../devflow.sqlite'),
        logging: false,
      });
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('[Database] Connected successfully via SQLite fallback.');
    } else {
      throw error;
    }
  }
};

module.exports = { sequelize, connectDB };
