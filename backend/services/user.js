import { Sequelize, models } from '../models';
import bcrypt from 'bcrypt';
import validate from '../validate';

const { Op } = Sequelize;

const { User } = models;

const create = async (name, username, password) => {
	const passwordHash = await bcrypt.hash(password, 10);

	return await User.create({ name, username, password: passwordHash });
};

const findByUsername = (username) => {
	const user = User.findOne({where: { username }});

	return user;
};

const getOne = async (id) => {
	validate.isId(id);
	
	return await User.findOne({ where: { id }});
};

const passwordMatches = async (user, password) => {
	return await bcrypt.compare(password, user.get('password'));
};

export default { create, findByUsername, passwordMatches, getOne };