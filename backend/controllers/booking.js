import { Router } from 'express';
import bookingService from '../services/booking';

const route = Router();

route.route('/')
	.get((req, res) => {
		res.json([]);
	});

export default route;