import { sequelize, models } from '../models';
import validate from '../validate';

const { Item } = models;

const getAll = async () => {
	return await Item.findAll({
		order: [['order', 'ASC']]
	});
};

const getOne = async (id) => {
	validate.isId(id);

	return await Item.find({ where: { id }});
};

const create = async (data) => {
	const item = await Item.create(data);

	return item;
};

const moveDown = async (id) => {
	validate.isId(id);

	await sequelize.query(
		`SELECT move_down('Items', ?)`,
		{ replacements: [id] }
	);
};

const moveUp = async (id) => {
	validate.isId(id);

	await sequelize.query(
		`SELECT move_up('Items', ?)`,
		{ replacements: [id] }
	);
};

export default { getAll, getOne, create, moveDown, moveUp };