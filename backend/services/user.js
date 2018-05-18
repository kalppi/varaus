import { Sequelize, models } from '../models';

const { Op } = Sequelize;

const { User } = models;

const getAll = async () => {
	return await User.findAll();
};

const getOne = async (id) => {
	return await User.find({ where: { id }});
};

const search = async (query) => {
	query = query.toLowerCase();

	return await User.findAll({
		where: {
			simple_name: {
				[Op.like]: `%${query}%`
			}
		}
	});
};

const count = async () => {
	return await User.count();
};

export default { getAll, getOne, search, count };