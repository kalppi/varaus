import { models } from '../models';

const { Booking } = models;

const getAll = async () => {
	return await Booking.findAll();
};

const create = async (data) => {
	return await Booking.create(data);
};

export default { getAll, create };