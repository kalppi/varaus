import 'dotenv/config';
import { sequelize, models } from '../models';
import history from '../services/history';
import bookingService from '../services/booking';

const { Item, User } = models;

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
	sequelize.close();
});

let first = null, second = null;

describe('History', () => {
	test('create is recorded', async () => {
		first = await bookingService.create({
				start: '2018-01-01',
				end: '2018-01-02',
				ItemId: item.get('id'),
				User: {
					name: 'Pera',
					email: 'pera@google.fi'
				}
			});

		expect(await history.length()).toBe(1);
	});

	test('delete is recorded', async () => {
		await bookingService.delete(first.id);

		expect(await history.length()).toBe(2);
	});

	test('change is recorded', async () => {
		second = await bookingService.create({
				start: '2016-04-01',
				end: '2016-04-02',
				ItemId: item.get('id'),
				User: {
					name: 'Mikko',
					email: 'mikko@google.fi'
				}
			});

		await bookingService.update(second.get('id'), {
			start: '2016-04-02',
			end: '2016-04-03'
		});

		expect(await history.length()).toBe(4);
	});

	test('peek works', async () => {
		const data = await bookingService.create({
				start: '2018-03-01',
				end: '2018-03-02',
				ItemId: item.get('id'),
				User: {
					name: 'Mara',
					email: 'mara@google.fi'
				}
			});

		const peek = await history.peek();

		expect(peek.get('data').id).toBe(data.id);
		expect(peek.get('type')).toBe('create');
	});

	test('lengthForBooking works', async () => {
		expect(await history.lengthForBooking(first.id)).toBe(2);
	});

	test('getForBooking works', async () => {
		const h = await history.getForBooking(second.id);

		expect(h.length).toBe(2);
	});

	test('peekForBooking works', async () => {
		const peek = await history.peekForBooking(first.id);

		expect(peek.get('data').id).toBe(first.id);
		expect(peek.get('type')).toBe('delete');
	});

	test('peek and peekForBooking return null when no history', async () => {
		await history.clear();

		expect(await history.peek()).toBe(null);
		expect(await history.peekForBooking(1)).toBe(null);
	});
});