import Sequelize from 'sequelize';
import pg from 'pg';

pg.defaults.ssl = true;

const sequelize = new Sequelize(process.env.DB, {
	operatorsAliases: false,
	logging: process.env.NODE_ENV === 'dev'
});

const Item = sequelize.import('./item');

sequelize.sync();

export { sequelize, Item };