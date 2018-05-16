import { Router } from 'express';
import userService from '../services/user';

const route = Router();

route.route('/')
	.get(async (req, res) => {
		const data = await userService.getAll();
		res.json(data);
	});

export default route;