
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

	const bookings = [{
		start: '2018-10-13',
		end: '2018-10-14',
		ItemId: items[0].get('id')
	}, {
		start: '2018-10-14',
		end: '2018-10-16',
		ItemId: items[0].get('id')
	}, {
		start: '2018-10-19',
		end: '2018-10-22',
		ItemId: items[0].get('id')
	}, {
		start: '2018-10-23',
		end: '2018-10-25',
		ItemId: items[0].get('id')
	} , {
		start: '2018-10-12',
		end: '2018-10-16',
		ItemId: items[2].get('id')
	}];

	await models.Booking.bulkCreate(bookings);

	return { items, bookings };
};