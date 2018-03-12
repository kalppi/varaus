import fs from 'fs';
import Sequelize from 'sequelize';
import pg from 'pg';

pg.defaults.ssl = true;

const sequelize = new Sequelize(process.env.DB, {
	operatorsAliases: false,
	logging: process.env.NODE_ENV === 'dev' ? console.log : false
});

const modelFiles = fs.readdirSync(__dirname)
	.filter(file => !file.startsWith('index'));


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

sequelize.sync();

export { sequelize, models };