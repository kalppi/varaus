import { models } from '../models';

const { Booking, UserInfo, Item } = models;

const getAll = async () => {
	return await Booking.findAll({include: [{model: UserInfo, attributes: ['name']}]});
};

const getOne = async (id) => {
	return await Booking.find({ where: { id }, include: [ Item, UserInfo ]});
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