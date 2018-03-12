import { Router } from 'express';
import bookingService from '../services/booking';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		const data = await bookingService.getAll();

		res.json(data);
	})
	.post(async (req, res) => {
		const data = req.body;
		const ret = await bookingService.create(data);

		res.status(201).json(ret);
	});

export default route;