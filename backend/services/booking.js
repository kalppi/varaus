import { sequelize, models } from '../models';

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

const search = async (query) => {
	if(!query || query.length < 3) return [];

	const rows = await sequelize.query(
		`SELECT
			b.id, b.start, b."end",b."UserInfoId",
			"ItemId", ui.name AS "UserInfo.name", ui.email AS "UserInfo.email", i.name AS "Item.name"
		FROM (SELECT id, start, "end", "UserInfoId", "ItemId", UNNEST(search_data) AS part FROM "Bookings") b
		INNER JOIN "UserInfos" ui ON ui.id = b."UserInfoId"
		INNER JOIN "Items" i ON i.id = b."ItemId"
		WHERE part LIKE ?
		GROUP BY b.id, start, "end", "UserInfoId", "ItemId", ui.name, ui.email, i.name
		LIMIT 20`,
		{ replacements: [query + '%'], type: sequelize.QueryTypes.SELECT  }
	);

	const rtn = [];

	for(let row of rows) {
		const obj = {};

		for(let key in row) {
			if(key.indexOf('.') !== -1) {
				const [left, right] = key.split('.', 2);

				if(!obj[left]) obj[left] = {};

				obj[left][right] = row[key];
			} else {
				obj[key] = row[key];
			}
		}

		rtn.push(obj);
	}

	return rtn;
};

export default { getAll, getOne, create, update, delete: del, search };