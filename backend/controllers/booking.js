import { Router } from 'express';
import bookingService from '../services/booking';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		const start = req.query.start;
		const end = req.query.end;

		if(start && end) {
			const data = await bookingService.getAllBetween(start, end);
			res.json(data);
		} else {
			const data = await bookingService.getAll();
			res.json(data);
		}
	})
	.post(async (req, res) => {
		const data = req.body;

		try {
			const ret = await bookingService.create(data);

			res.status(201).json(ret);
		} catch (e) {
			let error = 'unknown';

			if(e.toString().match(/overlap/)) {
				error = 'overlap';
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
		const data = await bookingService.getOne(id);

		res.json(data);
	})
	.put(async (req, res) => {
		const id = req.params.id;
		const data = req.body;

		await bookingService.update(id, data);

		res.status(200).json({});
	})
	.delete(async (req, res) => {
		const id = req.params.id;

		await bookingService.delete(id);

		res.status(200).json({});
	});

export default route;