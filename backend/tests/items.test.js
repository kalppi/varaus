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
});

describe.skip('api', () => {
	test('items are returned as json', async () => {
		const data = await api
			.get('/api/items')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.length).toBe(items.length);
	});
});

afterAll(() => {
	server.close();
});

