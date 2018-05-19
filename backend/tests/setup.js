export default async (sequelize, models) => {
	await sequelize.sync({ force: true });
	
	const items = await models.Item.bulkCreate([{
		name: 'AAA'
	}, {
		name: 'BBB'
	}, {
		name: 'CCC'
	}], {
		returning: true
	});

	let bookings = [{
		start: '2018-10-13',
		end: '2018-10-14',
		ItemId: items[0].get('id'),
		info: {
			name: 'Pera Perttilä',
			email: 'peramera@altavista.com'
		}
	}, {
		start: '2018-10-14',
		end: '2018-10-16',
		ItemId: items[0].get('id'),
		info: {
			name: 'Mará',
			email: 'maarrraa@google.fi'
		}
	}, {
		start: '2018-10-19',
		end: '2018-10-22',
		ItemId: items[0].get('id'),
		info: {
			name: 'Pera',
			email: 'pera@google.fi'
		}
	}, {
		start: '2018-10-23',
		end: '2018-10-25',
		ItemId: items[0].get('id'),
		info: {
			name: 'Mara',
			email: 'mara@yahoo.fi'
		}
	}, {
		start: '2018-10-12',
		end: '2018-10-16',
		ItemId: items[2].get('id'),
		info: {
			name: 'Jussi',
			email: 'jussi@google.fi'
		}
	}, {
		start: '2018-10-15',
		end: '2018-10-18',
		ItemId: items[1].get('id'),
		info: {
			name: 'Maisa-Inkeri Kullervoinen',
			email: 'kuuuul@google.fi'
		}
	}, {
		start: '2018-08-02',
		end: '2018-08-04',
		ItemId: items[1].get('id'),
		info: {
			name: 'Pertti Paloheinä',
			email: 'perrrr@google.fi'
		}
	}];

	const infos = bookings.map(booking => booking.info);
	const customers  = await models.Customer.bulkCreate(infos, { returning: true });

	for(let i = 0; i < bookings.length; i++) {
		bookings[i].CustomerId = customers[i].get('id');
	}

	bookings = await models.Booking.bulkCreate(bookings, { returning: true });

	return { items, bookings, customers };
};