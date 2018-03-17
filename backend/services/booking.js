import { models } from '../models';

const { Booking, UserInfo, Item } = models;

const getAll = async () => {
	return await Booking.findAll({include: [{model: UserInfo, attributes: ['name']}]});
};

const getOne = async (id) => {
	return await Booking.find({ where: { id }, include: [ Item, UserInfo ]});
};

const create = async (data) => {
	if(data.UserInfo) {
		const info = await UserInfo.create(data.UserInfo);

		return await Booking.create({...data, UserInfoId: info.get('id')}, {include: [Item, UserInfo]});
	} else {
		return await Booking.create(data);
	}
};

const update = async (id, data) => {
	const rtn = await Booking.update(data, { where: { id }, fields: Object.keys(data), returning: true });

	if(data.UserInfo) {
		await UserInfo.update(data.UserInfo, { where: {id: rtn[1][0].get('UserInfoId')}, fields: Object.keys(data.UserInfo)});
	}

	return rtn;
};

const del = async (id) => {
	const rtn = await Booking.destroy({ where: { id }});

	return rtn;
};

export default { getAll, getOne, create, update, delete: del };