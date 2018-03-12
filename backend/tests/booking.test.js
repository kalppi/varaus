import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';

const { Item, Booking, UserData } = models;
const api = supertest(app);

let items = null;

beforeAll(async () => {
	await sequelize.sync({ force: true });
	
	items = await Item.bulkCreate([{
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

		expect(data.body.length).toBe(2);
	});

	test('can create a booking', async () => {
		const rtn = await api
			.post('/booking')
			.send({
				start: '2018-12-12',
				end: '2018-12-13',
				ItemId: items[2].get('id')
			})
			.set('Content-Type', 'application/json')
			.expect(201);

		expect(rtn.body.start).toBe('2018-12-12');
		expect(rtn.body.end).toBe('2018-12-13');
	});
});

afterAll(() => {
	server.close();
});

