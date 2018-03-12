import { models } from '../models';

const { Booking } = models;

const getAll = () => {
	return Booking.findAll();
};

export default { getAll };