import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import history from '../services/history';

const { Item, User } = models;
const api = supertest(app);

let item = null;

beforeAll(async () => {
	await sequelize.sync({ force: true });

	item = await models.Item.create({
		name: 'AAA'
	}, {
		returning: true
	});
});

afterAll(() => {
	server.close();
});

describe('History', () => {
	test('create is recorded', async () => {
		await api
			.post('/api/booking')
			.send({
				start: '2018-01-01',
				end: '2018-01-02',
				ItemId: item.get('id'),
				User: {
					name: 'Pera',
					email: 'pera@google.fi'
				}
			})
			.set('Content-Type', 'application/json');

		expect(history.length()).toBe(1);
	});

	test('peek works', async () => {
		const data = await api
			.post('/api/booking')
			.send({
				start: '2018-02-01',
				end: '2018-02-02',
				ItemId: item.get('id'),
				User: {
					name: 'Mara',
					email: 'mara@google.fi'
				}
			})
			.set('Content-Type', 'application/json');

		expect(history.peek().booking.id).toBe(data.body.id);
	});
});