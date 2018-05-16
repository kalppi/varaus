import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import setup from './setup';

const { Item, Booking, UserData } = models;
const api = supertest(app);

let users = null;

beforeAll(async () => {
	({users} = await setup(sequelize, models));
});

describe('api', () => {
	test('users are returned as json', async () => {
		const data = await api
			.get('/api/user')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.length).toBe(users.length);
	});

	test('user can be found with an id', async () => {
		const data = await api
			.get('/api/user/1')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.id).toBe(1);
	});

	test('non-existing id returns 404', async () => {
		const data = await api
			.get('/api/user/10000000')
			.expect(404);
	});
});

afterAll(() => {
	server.close();
});

