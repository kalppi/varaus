import { Router } from 'express';
import customerService from '../services/customer';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		const data = await customerService.getAll();

		res.json(data);
	});

route.route('/search')
	.get(async (req, res) => {
		const ret = await customerService.search(req.query.query);

		res.status(201).json(ret);
	});

route.route('/:id')
	.get(async (req, res) => {
		const id = req.params.id;

		try {
			const data = await customerService.getOne(id);

			if(data) {
				res.json(data);
			} else {
				res.status(404).end();
			}
		} catch (e) {
			res.status(400).end();
		}
	});

export default route;