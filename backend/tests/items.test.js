import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import setup from './setup';
import { login, get, post } from './testHelper';

const { Item, Booking } = models;
const api = supertest(app);

let items = null, token = null;

beforeAll(async () => {
	({items} = await setup(sequelize, models));

	await login(api);
});

afterAll(() => {
	server.close();
});

describe('Items api', () => {
	test('items are returned as json', async () => {
		const data = await get('/api/item')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.length).toBe(items.length);
	});

	test('can create a new item', async () => {
		const data = await post('/api/item')
			.send({
				name: 'DDD'
			})
			.expect(200);

		expect(data.body.name).toBe('DDD');
	});
});

