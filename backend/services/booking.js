import { Sequelize, sequelize, models } from '../models';
import history from './history';

const { Booking, User, Item } = models;

const { Op } = Sequelize;

const cleanRows = rows => {
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

const getAll = async () => {
	return await Booking.findAll({include: [{model: User, attributes: ['name']}]});
};

const getAllBetween = async (start, end) => {
	const Op = Sequelize.Op;

	return await Booking.findAll({
		where: {
			end: {
				[Op.gte]: start
			},
			start: {
				[Op.lte]: end
			}
		},
		include: [{model: User, attributes: ['name']}]
	});
};	

const getOne = async (id) => {
	return await Booking.find({ where: { id }, include: [ Item, User ]});
};

const create = async (data) => {
	let booking = null;

	if(data.User) {
		const info = await User.create(data.User);
		delete data['User'];
		booking = await Booking.create({...data, UserId: info.get('id')});
		booking = await getOne(booking.get('id'));
	} else if(data.UserId) {
		booking = await Booking.create({...data}, {include: [Item, User]});
	} else {
		throw new Error('Customer info not present');
	}

	if(booking !== null) {
		await history.addCreate(booking.get({plain: true}));
	}

	return booking;
};

const update = async (id, data) => {
	const booking = await Booking.find({where: { id }, attributes: ['start', 'end', 'ItemId', 'UserId']});
	const rtn = await Booking.update(data, { where: { id }, fields: Object.keys(data), returning: true });

	if(data.User) {
		await User.update(data.User, { where: {id: rtn[1][0].get('UserId')}, fields: Object.keys(data.User)});
	}

	await history.addChange(id, booking.get({plain: true}), rtn[1][0].get({plain: true}));

	return rtn;
};

const del = async (id) => {
	const booking = await Booking.find({where: { id }, include: [Item, User]});
	const rtn = await Booking.destroy({ where: { id }});

	if(booking !== null) {
		await history.addDelete(booking.get({plain: true}));
	}

	return rtn;
};

const search = async (query) => {
	if(!query || query.length < 3) return [];

	query = query.toLowerCase();

	const rows = await sequelize.query(
		`SELECT
			b.id, b.start, b."end",b."UserId",
			"ItemId", ui.name AS "User.name", ui.email AS "User.email", i.name AS "Item.name"
		FROM (SELECT id, start, "end", "UserId", "ItemId", UNNEST(search_data) AS part FROM "Bookings") b
		INNER JOIN "Users" ui ON ui.id = b."UserId"
		INNER JOIN "Items" i ON i.id = b."ItemId"
		WHERE part LIKE ?
		GROUP BY b.id, start, "end", "UserId", "ItemId", ui.name, ui.email, i.name
		LIMIT 20`,
		{ replacements: [query + '%'], type: sequelize.QueryTypes.SELECT  }
	);

	return cleanRows(rows);
};

export default { getAll, getAllBetween, getOne, create, update, delete: del, search };