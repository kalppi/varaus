import { models } from '../models';

const { Booking, UserInfo } = models;

const getAll = async () => {
	return await Booking.findAll();
};

const create = async (data) => {
	if(data.info) {
		const info = await UserInfo.create(data.info);

		return await Booking.create({...data, UserInfoId: info.get('id')})
	} else {
		return await Booking.create(data);
	}
};

export default { getAll, create };