import { Sequelize, models } from '../models';
import bcrypt from 'bcrypt';

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

const passwordMatches = async (user, password) => {
	return await bcrypt.compare(password, user.get('password'));
};

export default { create, findByUsername, passwordMatches };