import { Router } from 'express';
import bookingService from '../services/booking';

const route = Router();

route.route('/booking')
	.get(async (req, res) => {
		const data = await bookingService.getAll();

		res.json(data);
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

export default route;