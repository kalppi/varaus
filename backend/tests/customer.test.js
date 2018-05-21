import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import customerService from '../services/customer';
import setup from './setup';
import { login, get } from './testHelper';

const { Item, Booking } = models;
const api = supertest(app);

let customers = null;

beforeAll(async () => {
	({customers} = await setup(sequelize, models));

	await login(api);
});

afterAll(() => {
	server.close();
});

describe('Customer api', () => {
	test('customers are returned as json', async () => {
		const data = await get('/api/customer')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.length).toBe(customers.length);
	});

	test('customer can be found with an id', async () => {
		const data = await get('/api/customer/1')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.id).toBe(1);
	});

	test('non-existing id returns 404', async () => {
		const data = await get('/api/customer/10000000')
			.expect(404);
	});

	test('can search', async () => {
		const rtn = await get('/api/customer/search')
			.query({
				query: 'Mara'
			})
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(rtn.body.length).toBe(2);
	});
});

describe('Misc', () => {
	test('count is right', async () => {
		expect(await customerService.count()).toBe(customers.length);
	});
});