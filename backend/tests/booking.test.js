import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';

const { Item, Booking, UserData } = models;

const api = supertest(app);

beforeAll(async () => {
	await sequelize.sync({ force: true });
	
	const items = await Item.bulkCreate([{
		name: 'AAA'
	}, {
		name: 'BBB'
	}, {
		name: 'CCC'
	}], {
		returning: true
	});

	Booking.bulkCreate([{
		start: '2018-10-13',
		end: '2018-10-14',
		ItemId: items[0].get('id')
	}, {
		start: '2018-10-14',
		end: '2018-10-16',
		ItemId: items[0].get('id')
	}]);
});

describe('api', () => {
	test('bookings are returned as json', async () => {
		const data = await api
			.get('/booking')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});
});

afterAll(() => {
	server.close();
});

