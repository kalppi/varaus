import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import setup from './setup';

const api = supertest(app);

let user = null;

beforeAll(async () => {
	({user} = await setup(sequelize, models));
});

afterAll(() => {
	server.close();
});

describe('Login api', () => {
	test('can login', async () => {
		await api
			.post('/api/login')
			.send({
				username: 'test',
				password: 'test'
			})
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('login returns token and user info', async () => {
		const data = await api
			.post('/api/login')
			.send({
				username: 'test',
				password: 'test'
			})
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(data.body.token).toBeTruthy();
		expect(data.body.username).toBeTruthy();
		expect(data.body.name).toBeTruthy();
	});

	test('wrong username returns 401', async () => {
		await api
			.post('/api/login')
			.send({
				username: 'wrong',
				password: 'test'
			})
			.expect(401)
	});

	test('wrong password returns 401', async () => {
		await api
			.post('/api/login')
			.send({
				username: 'test',
				password: 'wrong'
			})
			.expect(401)
	});
});

