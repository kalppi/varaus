import { models } from '../models';

const { Item } = models;

const getAll = async () => {
	return await Item.findAll();
};

const getOne = async (id) => {
	return await Item.find({ where: { id }});
};

export default { getAll, getOne };