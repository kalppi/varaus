import { Sequelize, sequelize, models } from '../models';

const { History } = models;
const { Op } = Sequelize;

const addChange = async (id, oldValues, newValues) => {
	const changes = {};

	for(let key of Object.keys(oldValues)) {
		const ov = oldValues[key];
		const nv = newValues[key];

		if(ov !== nv) {
			changes[key] = { old: ov, new: nv};
		}
	}

	await History.create({
		type: 'change',
		data: { id, ...changes }
	});
};

const addDelete = async (booking) => {
	await History.create({
		type: 'delete',
		data: {
			id: booking.id,
			start: booking.start,
			end: booking.end,
			ItemId: booking.ItemId,
			CustomerId: booking.CustomerId
		}
	});
};

const addCreate = async (booking) => {
	await History.create({
		type: 'create',
		data: {
			id: booking.id,
			start: booking.start,
			end: booking.end,
			ItemId: booking.ItemId,
			CustomerId: booking.CustomerId
		}
	});
};

const getForBooking = async (id) => {
	const entries = await History.findAll({
		where: { 'data.id': id },
		order: [['createdAt', 'ASC']]
	});

	return entries;
};

const length = async () => {
	return await History.count();
};

const lengthForBooking = async (id) => {
	return await History.count({
		where: { 'data.id': id }
	});
};

const peek = async () => {
	const entries = await History.findAll({
		limit: 1,
		order: [['createdAt', 'DESC']]
	});

	if(entries.length == 0) return null;
	else return entries[0];
};

const peekForBooking = async (id) => {
	const entries = await History.findAll({
		limit: 1,
		where: { 'data.id': id },
		order: [['createdAt', 'DESC']]
	});

	if(entries.length == 0) return null;
	else return entries[0];
};

const clear = async () => {
	await History.destroy({truncate: true});
};

export default { addChange, addDelete, addCreate, getForBooking, length, lengthForBooking, peek, peekForBooking, clear };