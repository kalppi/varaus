import { Router } from 'express';
import userService from '../services/user';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		const data = await userService.getAll();

		res.json(data);
	});

route.route('/search')
	.get(async (req, res) => {
		const ret = await userService.search(req.query.query);

		res.status(201).json(ret);
	});

route.route('/:id')
	.get(async (req, res) => {
		const id = req.params.id;
		const data = await userService.getOne(id);

		if(data) {
			res.json(data);
		} else {
			res.status(404).end();
		}
	});

export default route;