import { models } from '../models';

const { User } = models;

const getAll = async () => {
	return await User.findAll();
};

const getOne = async (id) => {
	return await User.find({ where: { id }});
};

export default { getAll, getOne };