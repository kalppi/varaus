import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models, loadQueries } from '../models';

const { Item, Booking, UserData } = models;
const api = supertest(app);

let items = null;
let bookings = null;

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

	bookings = [{
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
	}];

	Booking.bulkCreate(bookings);
});

describe('api', () => {
	test('bookings are returned as json', async () => {
		const data = await api
			.get('/booking')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.length).toBe(bookings.length);
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

	test.only('can\'t create overlapping bookings', async () => {
		const bookings = [{
				start: '2018-10-12',
				end: '2018-10-15',		
			}, {
				start: '2018-10-10',
				end: '2018-10-14',
			}, {
				start: '2018-10-13',
				end: '2018-10-15',
			}, {
				start: '2018-10-22',
				end: '2018-10-27',
			}];

		const promises = [];
		for(let booking of bookings) {
			promises.push(await api
				.post('/booking')
				.send({
					...booking,
					ItemId: items[0].get('id')
				})
				.set('Content-Type', 'application/json')
			);
		}

		const rtns = (await Promise.all(promises))
			.map(p => p.body);

		for(let rtn of rtns) {
			expect(rtn).toMatchObject({error: 'overlap'});
		}
	});
});

afterAll(() => {
	server.close();
});

