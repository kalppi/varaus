import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import setup from './setup';
import customerService from '../services/customer';
import { login, get, post, put, del } from './testHelper';
import Shape from 'shape.js';

const { Item, Booking } = models;
const api = supertest(app);

let items = null;
let bookings = null;
let customers = null;

beforeAll(async () => {
	({items, bookings, customers} = await setup(sequelize, models));

	await login(api);
});

afterAll(() => {
	server.close();
});

const idShape = Shape.integer({min: 1});
const dateShape = Shape.regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
const dateTimeShape = Shape.regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T/);

const itemShape = Shape.object()
					.fields({
						id: idShape,
						name: Shape.string(),
						order: Shape.integer(),
						createdAt: dateTimeShape,
						updatedAt: dateTimeShape
					});

const customerShape = Shape.object()
						.fields({
							id: idShape,
							name: Shape.any(),
							email: Shape.string(),
							simple_name: Shape.string(),
							createdAt: dateTimeShape,
							updatedAt: dateTimeShape
						});

const bookingShape = Shape.object()
						.fields({
							id: idShape,
							start: dateShape,
							end: dateShape,
							search_data: Shape.array(),
							createdAt: dateTimeShape,
							updatedAt: dateTimeShape,
							ItemId: idShape,
							CustomerId: idShape,
							Customer: customerShape,
							Item: itemShape
						});

const bookingsShape = Shape.arrayOf(bookingShape)
						.omit('Item')
						.field('Customer', customerShape.clone().only('name'))

describe('Booking api', () => {
	test('bookings are returned as json', async () => {
		const data = await get('/api/booking')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.length).toBe(bookings.length);
	});

	test('a booking is returned by id', async () => {
		await get('/api/booking/' + bookings[0].get('id'))
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('a booking has required shape', async () => {
		await get('/api/booking/' + bookings[0].get('id'))
			.expect(200)
			.expect(bookingShape.matchesRequest());
	});

	test('bookings have required shape', async () => {
		const data = await get('/api/booking')
			.expect(200)
			.expect(bookingsShape.matchesRequest());
	});

	test('non-existing id returns 404', async () => {
		const data = await get('/api/booking/10000000')
			.expect(404);
	});

	test('bookings are returned between specified dates', async () => {
		const data = await get('/api/booking')
			.query({
				start: '2018-08-02',
				end: '2018-08-31'
			});

		expect(data.body.length).toBe(1);
	});

	test('can\'t create a booking without customer info', async () => {
		const rtn = await post('/api/booking')
			.send({
				start: '2018-12-12',
				end: '2018-12-13',
				ItemId: items[2].get('id')
			})
			.set('Content-Type', 'application/json')
			.expect(400);
	});

	test('can create a booking with existing customer', async () => {
		const rtn = await post('/api/booking')
			.send({
				start: '2018-12-12',
				end: '2018-12-13',
				ItemId: items[2].get('id'),
				CustomerId: 1
			})
			.set('Content-Type', 'application/json')
			.expect(201);

		expect(rtn.body.start).toBe('2018-12-12');
		expect(rtn.body.end).toBe('2018-12-13');
	});

	test('can create a booking with a new customer', async () => {
		const rtn = await post('/api/booking')
			.send({
				start: '2018-11-11',
				end: '2018-11-12',
				ItemId: items[2].get('id'),
				Customer: {
					name: 'Pera',
					email: 'pera@google.fi'
				}
			})
			.set('Content-Type', 'application/json')
			.expect(201);

		const { start, end, CustomerId } = rtn.body;

		expect(start).toBe('2018-11-11');
		expect(end).toBe('2018-11-12');
		expect(CustomerId).toBeTruthy();
	});

	test('can create a booking with existing customer, and update customer info', async () => {
		const rtn = await post('/api/booking')
			.send({
				start: '2019-11-11',
				end: '2019-11-12',
				ItemId: items[2].get('id'),
				CustomerId: 1,
				Customer: {
					name: 'Peraa'
				}
			})
			.set('Content-Type', 'application/json')
			.expect(201);

		const { start, end, CustomerId, Customer } = rtn.body;

		expect(start).toBe('2019-11-11');
		expect(end).toBe('2019-11-12');
		expect(CustomerId).toBe(1);
		expect(Customer.name).toBe('Peraa');
		expect(Customer.email).toBe('peramera@altavista.com');
	});

	test('booking end must be after start', async () => {
		await post('/api/booking')
			.send({
				start: '2016-12-12',
				end: '2016-12-12',
				ItemId: items[2].get('id'),
				CustomerId: 1
			})
			.set('Content-Type', 'application/json')
			.expect(400);
	});

	test('can update a booking', async () => {
		await put('/api/booking/' + bookings[4].get('id'))
			.send({
				start: '2018-11-12',
				end: '2018-11-13',
				ItemId: items[1].get('id'),
				Customer: {
					name: 'Matti',
					email: 'matti@google.fi'
				}
			})
			.set('Content-Type', 'application/json')
			.expect(200);

		const rtn = await get('/api/booking/' + bookings[4].get('id'));

		const { start, end, ItemId, Customer } = rtn.body;

		expect(start).toBe('2018-11-12');
		expect(end).toBe('2018-11-13');
		expect(ItemId).toBe(items[1].get('id'));
		expect(Customer.name).toBe('Matti');
		expect(Customer.email).toBe('matti@google.fi');
	});

	test('can update a booking start and end and not get overlapping error', async () => {
		const rtn = await post('/api/booking')
			.send({
				start: '2016-12-12',
				end: '2016-12-17',
				ItemId: items[2].get('id'),
				CustomerId: 1
			})
			.set('Content-Type', 'application/json')
			.expect(201);

		await put('/api/booking/' + rtn.body.id)
			.send({
				start: '2016-12-13',
				end: '2016-12-16',
			})
			.expect(200);
	});

	test('can delete a booking', async () => {
		await del('/api/booking/' + bookings[4].get('id'))
			.expect(200);

		const rtn = await get('/api/booking/' + bookings[4].get('id'))
			.expect(404);
	});

	test('trying to delete an unknown booking returns 409', async () => {
		await del('/api/booking/234423')
			.expect(409);
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
			promises.push(await post('/api/booking')
				.send({
					...booking,
					ItemId: items[0].get('id'),
					CustomerId: 1
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
		const rtn = await get('/api/booking/search')
			.query({
				query: 'mara'
			})
			.expect(201)
			.expect('Content-Type', /application\/json/);
		
		expect(rtn.body.length).toBe(2);
	});

	test('can search with multiple terms', async () => {
		const rtn = await get('/api/booking/search')
			.query({
				query: 'mai inkeri'
			})
			.expect(201)
			.expect('Content-Type', /application\/json/);
		
		expect(rtn.body.length).toBe(1);
	});

	test('no extra customers are created', async () => {
		expect(await customerService.count()).toBe(customers.length + 1);
	});

	test('history is returned as json', async () => {
		const rtn = await post('/api/booking')
			.send({
				start: '2015-12-12',
				end: '2015-12-13',
				ItemId: items[2].get('id'),
				CustomerId: 1
			})
			.set('Content-Type', 'application/json');

		const history = await get(`/api/booking/${rtn.body.id}/history`)
			.expect('Content-Type', /application\/json/);
	});

	describe('Argument validation', () => {
		test('booking id', async () => {
			await get('/api/booking/as22')
				.expect(400);
		});

		test('between dates', async () => {
			await get('/api/booking')
				.query({
					start: '2018-08-02',
					end: '2018-0831'
				})
				.expect(400);

			await get('/api/booking')
				.query({
					start: '08-02',
					end: '2018-08-31'
				})
				.expect(400);
		});
	});
});