import 'dotenv/config';
import supertest from 'supertest';
import { app, server } from '../index';

const api = supertest(app);

test('bookings are returned as json', async () => {
	await api
		.get('/booking')
		.expect(200)
		.expect('Content-Type', /application\/json/)
});

afterAll(() => {
	server.close()
});
