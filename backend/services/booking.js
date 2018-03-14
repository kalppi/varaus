import { models } from '../models';

const { Booking, UserInfo } = models;

const getAll = async () => {
	return await Booking.findAll();
};

const getOne = async (id) => {
	return await Booking.find({ where: { id }, include: [ UserInfo ]});
};

const create = async (data) => {
	if(data.info) {
		const info = await UserInfo.create(data.info);

		return await Booking.create({...data, UserInfoId: info.get('id')})
	} else {
		return await Booking.create(data);
	}
};

export default { getAll, getOne, create };