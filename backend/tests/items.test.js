import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import setup from './setup';

const { Item, Booking } = models;
const api = supertest(app);

let items = null;

beforeAll(async () => {
	({items} = await setup(sequelize, models));
});

afterAll(() => {
	server.close();
});

describe('Items api', () => {
	test('items are returned as json', async () => {
		const data = await api
			.get('/api/item')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.length).toBe(items.length);
	});
});

