import { Router } from 'express';
import historyService from '../services/history';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		try {
			const data = await historyService.getAll();
			res.json(data);
		} catch (e) {
			res.status(400).end();
		}
	});

export default route;