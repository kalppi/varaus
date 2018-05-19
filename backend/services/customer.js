import { Sequelize, models } from '../models';

const { Op } = Sequelize;

const { Customer } = models;

const getAll = async () => {
	return await Customer.findAll();
};

const getOne = async (id) => {
	return await Customer.find({ where: { id }});
};

const search = async (query) => {
	query = query.toLowerCase();

	return await Customer.findAll({
		where: {
			simple_name: {
				[Op.like]: `%${query}%`
			}
		}
	});
};

const count = async () => {
	return await Customer.count();
};

export default { getAll, getOne, search, count };