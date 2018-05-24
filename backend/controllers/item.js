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
		} catch(e) {
			res.status(400).end();
		}
	});

route.route('/:id/down')
	.post(async (req, res) => {
		const id = req.params.id;

		await itemService.moveDown(id);

		res.status(200).json({});
	});

	route.route('/:id/up')
		.post(async (req, res) => {
			const id = req.params.id;

			await itemService.moveUp(id);

			res.status(200).json({});
		});

export default route;