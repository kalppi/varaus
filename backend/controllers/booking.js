import { Router } from 'express';
import bookingService from '../services/booking';
import historyService from '../services/history';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		const start = req.query.start;
		const end = req.query.end;

		try {
			if(start && end) {
				const data = await bookingService.getAllBetween(start, end);
				res.json(data);
			} else {
				const data = await bookingService.getAll();
				res.json(data);
			}
		} catch (e) {
			res.status(400).end();
		}
	})
	.post(async (req, res) => {
		const data = req.body;

		try {
			const ret = await bookingService.create(data);

			res.status(201).json(ret);
		} catch (e) {
			const err = e.toString();
			let error = 'unknown';

			switch(true) {
				case /overlap/i.test(err):
					error = 'overlap';
					break;
				case /customer info/i.test(err):
					error = 'missing field';
					break;
			}

			res.status(400).json({ error });
		}
	});

route.route('/search')
	.get(async (req, res) => {
		const ret = await bookingService.search(req.query.query);

		res.status(201).json(ret);
	});

route.route('/:id')
	.get(async (req, res) => {
		const id = req.params.id;

		try {
			const data = await bookingService.getOne(id);

			if(data) {
				res.json(data);
			} else {
				res.status(404).end();
			}
		} catch (e) {
			res.status(400).end();
		}
	})
	.put(async (req, res) => {
		const id = req.params.id;
		const data = req.body;

		try {
			await bookingService.update(id, data);

			res.status(200).json({});
		} catch (e) {
			res.status(400).end();
		}
	})
	.delete(async (req, res) => {
		const id = req.params.id;

		try {
			const rtn = await bookingService.delete(id);

			if(rtn == 1) {
				res.status(200).end();
			} else {
				res.status(409).end();
			}
		} catch (e) {
			res.status(400).end();
		}
	});

route.route('/:id/history')
	.get(async (req, res) => {
		const id = req.params.id;

		try {
			const data = await historyService.getForBooking(id);

			res.json(data);
		} catch (e) {
			res.status(400).end();
		}
	});

export default route;