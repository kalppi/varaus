import fs from 'fs';
import Sequelize from 'sequelize';
import pg from 'pg';
import { log } from '../utils';

pg.defaults.ssl = true;

let db = null;

switch(process.env.NODE_ENV) {
	case 'test':
		db = process.env.TEST_DB;
		break;
	case 'dev':
		db = process.env.DEV_DB;
		break;
	case 'production':
		db = process.env.DB;
		break;
}

const sequelize = new Sequelize(db, {
	operatorsAliases: false,
	dialect: 'postgres',
	logging: (text) => {
		log(text);
	}
});

const modelFiles = fs.readdirSync(__dirname)
	.filter(file => !file.startsWith('index') && file.endsWith('.js'));

const models = {};

modelFiles.forEach(file => {
	const model = sequelize.import(file);

	models[model.name] = model;
});


Object.keys(models).forEach(modelName => {
	if (models[modelName].associate) {
		models[modelName].associate(models);
	}
});

const oldSync = sequelize.sync;

sequelize.sync = async (...args) => {
	await oldSync.apply(sequelize, args);

	const query = fs.readFileSync(__dirname + '/query.sql');

	await sequelize.query(query.toString());
};

export { Sequelize, sequelize, models };