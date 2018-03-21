import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import setup from './setup';

const { Item, Booking, UserData } = models;
const api = supertest(app);

let items = null;
let bookings = null;

beforeAll(async () => {
	({items, bookings} = await setup(sequelize, models));
});

describe('api', () => {
	test('bookings are returned as json', async () => {
		const data = await api
			.get('/api/booking')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.length).toBe(bookings.length);
	});

	test('bookings are returned between specified dates', async () => {
		const data = await api
			.get('/api/booking')
			.query({
				start: '2018-08-02',
				end: '2018-08-31'
			});

		expect(data.body.length).toBe(1);
	});

	test('can create a booking', async () => {
		const rtn = await api
			.post('/api/booking')
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

	test('can update a booking', async () => {
		await api
			.put('/api/booking/' + bookings[4].get('id'))
			.send({
				start: '2018-11-12',
				end: '2018-11-13',
				ItemId: items[1].get('id'),
				UserInfo: {
					name: 'Matti',
					email: 'matti@google.fi'
				}
			})
			.set('Content-Type', 'application/json')
			.expect(200);

		const rtn = await api
			.get('/api/booking/' + bookings[4].get('id'));

		const { start, end, ItemId, UserInfo } = rtn.body;

		expect(start).toBe('2018-11-12');
		expect(end).toBe('2018-11-13');
		expect(ItemId).toBe(items[1].get('id'));
		expect(UserInfo.name).toBe('Matti');
		expect(UserInfo.email).toBe('matti@google.fi');
	});

	test('can delete a booking', async () => {
		await api
			.delete('/api/booking/' + bookings[4].get('id'))
			.expect(200);

		const rtn = await api
			.get('/api/booking/' + bookings[4].get('id'));

		expect(rtn.body).toBe(null);
	});

	test('can create a booking with info', async () => {
		const rtn = await api
			.post('/api/booking')
			.send({
				start: '2018-11-11',
				end: '2018-11-12',
				ItemId: items[2].get('id'),
				UserInfo: {
					name: 'Pera',
					email: 'pera@google.fi'
				}
			})
			.set('Content-Type', 'application/json')
			.expect(201);

		const { start, end, UserInfoId } = rtn.body;

		expect(start).toBe('2018-11-11');
		expect(end).toBe('2018-11-12');
		expect(UserInfoId).toBeTruthy();
	});

	test('can\'t create overlapping bookings', async () => {
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
				.post('/api/booking')
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

	test('can search', async () => {
		const rtn = await api
			.get('/api/booking/search')
			.query({
				query: 'per'
			})
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(rtn.body.length).toBe(3);
	});
});

afterAll(() => {
	server.close();
});

