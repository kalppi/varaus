import Sequelize from 'sequelize';
import pg from 'pg';

pg.defaults.ssl = true;

const seq = new Sequelize(process.env.DB, {
	operatorsAliases: false
});

const Item = seq.import('./item');

seq.sync();

export { Item };