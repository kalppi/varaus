import { Sequelize, sequelize, models } from '../models';
import history from './history';
import { numeric } from '../utils';

const { Booking, Customer, Item } = models;

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
	return await Booking.findAll({include: [{model: Customer, attributes: ['name']}]});
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
		include: [{model: Customer, attributes: ['name']}]
	});
};	

const getOne = async (id) => {
	return await Booking.find({ where: { id }, include: [ Item, Customer ]});
};

const create = async (data) => {
	let booking = null;

	if(numeric(data.CustomerId)) {
		if(data.Customer) {
			await Customer.update(data.Customer, { where: {id: data.CustomerId}, fields: Object.keys(data.Customer)});

			delete data['Customer'];
		}

		booking = await Booking.create({...data}, {include: [Item, Customer]});
	} else if(data.Customer) {
		const info = await Customer.create(data.Customer);
		delete data['Customer'];
		booking = await Booking.create({...data, CustomerId: info.get('id')});
	} else {
		throw new Error('Customer info not present');
	}

	booking = await getOne(booking.get('id'));

	if(booking !== null) {
		await history.addCreate(booking.get({plain: true}));
	}

	return booking;
};

const update = async (id, data) => {
	const booking = await Booking.find({where: { id }, attributes: ['start', 'end', 'ItemId', 'CustomerId']});
	const rtn = await Booking.update(data, { where: { id }, fields: Object.keys(data), returning: true });

	if(data.Customer) {
		await Customer.update(data.Customer, { where: {id: rtn[1][0].get('CustomerId')}, fields: Object.keys(data.Customer)});
	}

	await history.addChange(id, booking.get({plain: true}), rtn[1][0].get({plain: true}));

	return rtn;
};

const del = async (id) => {
	const booking = await Booking.find({where: { id }, include: [Item, Customer]});
	const rtn = await Booking.destroy({ where: { id }});

	if(booking !== null) {
		await history.addDelete(booking.get({plain: true}));
	}

	return rtn;
};

const search = async (query) => {
	if(!query || query.length < 3) return [];

	const searchParts = query.toLowerCase().split(' ')
							.map(s => s.trim())
							.filter(s => s.length > 0)
							.map(s => sequelize.escape(s + '%'))
							.map(s => `bool_or(part like ${s})`)
							.join(',');

	const rows = await sequelize.query(
		`SELECT
			b.id, b.start, b."end",b."CustomerId", b."ItemId",
			c.name AS "Customer.name", c.email AS "Customer.email",
			i.name AS "Item.name"
		FROM (
			SELECT
				id, start, "end", "CustomerId", "ItemId",
				ARRAY[${searchParts}] arr
			FROM "Bookings", UNNEST(search_data) AS part
			GROUP BY id
		) b
		INNER JOIN "Customers" c ON c.id = b."CustomerId"
		INNER JOIN "Items" i ON i.id = b."ItemId"
		WHERE true = ALL (arr)
		LIMIT 20`,
		{ type: sequelize.QueryTypes.SELECT }
	);

	return cleanRows(rows);
};

export default { getAll, getAllBetween, getOne, create, update, delete: del, search };