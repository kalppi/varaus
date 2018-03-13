import { models } from '../models';

const { Item } = models;

const getAll = async () => {
	return await Item.findAll();
};

export default { getAll };