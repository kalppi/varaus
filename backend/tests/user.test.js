import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import userService from '../services/user';
import setup from './setup';

const { Item, Booking, UserData } = models;
const api = supertest(app);

let users = null;

beforeAll(async () => {
	({users} = await setup(sequelize, models));
});

afterAll(() => {
	server.close();
});

describe('Customer api', () => {
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

	test('can search', async () => {
		const rtn = await api
			.get('/api/user/search')
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
		expect(await userService.count()).toBe(users.length);
	});
});