import { Sequelize, sequelize, models } from '../models';

const { History } = models;
const { Op } = Sequelize;


const snapshot = () => {

};

const addChange = async (id, change) => {
	await History.create({
		type: 'change',
		data: { id, ...change }
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
			UserId: booking.UserId
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
			UserId: booking.UserId
		}
	});
};

const getAll = () => {
	
};

const getForBooking = (id) => {
	
};

const length = async () => {
	return await History.count();
};

const lengthForBooking = (id) => {
	
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

export default { snapshot, addChange, addDelete, addCreate, getAll, getForBooking, length, lengthForBooking, peek, peekForBooking, clear };