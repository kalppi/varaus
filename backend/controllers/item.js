import { Router } from 'express';
import itemService from '../services/item';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		const data = await itemService.getAll();

		res.json(data);
	});

export default route;