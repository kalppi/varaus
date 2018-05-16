import { models } from '../models';

const { User } = models;

const getAll = async () => {
	return await User.findAll();
};

export default { getAll };