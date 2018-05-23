import { models } from '../models';
import validate from '../validate';

const { Item } = models;

const getAll = async () => {
	return await Item.findAll();
};

const getOne = async (id) => {
	validate.isId(id);

	return await Item.find({ where: { id }});
};

const create = async (data) => {
	const item = await Item.create(data);

	return item;
};

export default { getAll, getOne, create };