import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';
import { sequelize, models } from '../models';
import setup from './setup';
import { login, get, post, put } from './testHelper';

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

	test('items are returned in order', async () => {
		const data = await get('/api/item')
			.expect(200);

		const names = data.body.map(i => i.name);
		const orders = data.body.map(i => i.order);

		expect(names).toEqual(['AAA', 'BBB', 'CCC']);
		expect(orders).toEqual([1, 2, 3]);
	});

	test('can create a new item', async () => {
		const data = await post('/api/item/')
			.send({
				name: 'DDD'
			})
			.expect(201);

		expect(data.body.name).toBe('DDD');
	});

	test('can move down', async () => {
		await post('/api/item/1/down');

		const data = await get('/api/item')
			.expect(200);

		const names = data.body.map(i => i.name);
		const orders = data.body.map(i => i.order);

		expect(names).toEqual(['BBB', 'AAA', 'CCC', 'DDD']);
		expect(orders).toEqual([1, 2, 3, 4]);
	});

	test('can move up', async () => {
		await post('/api/item/3/up');

		const data = await get('/api/item')
			.expect(200);

		const names = data.body.map(i => i.name);
		const orders = data.body.map(i => i.order);

		expect(names).toEqual(['BBB', 'CCC', 'AAA', 'DDD']);
		expect(orders).toEqual([1, 2, 3, 4]);
	});

	test('can update an item', async () => {
		const data = await put('/api/item/1')
			.send({
				name: 'AAA2'
			});

		expect(data.body).toBeTruthy();
		expect(data.body.name).toBe('AAA2');
	});
});

