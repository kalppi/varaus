import { Router } from 'express';
import itemService from '../services/item';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		const data = await itemService.getAll();

		res.json(data);
	})
	.post(async (req, res) => {
		const data = req.body;

		try {
			const rtn = await itemService.create(data);

			res.status(201).json(rtn);
		} catch(e) {console.log(e);
			res.status(400).end();
		}
	});

export default route;