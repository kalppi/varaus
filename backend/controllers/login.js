import { Router } from 'express';
import userService from '../services/user';
import jwt from 'jsonwebtoken';

const route = Router();

route.route('/')
	.post(async (req, res) => {
		const body = req.body;
		const user = await userService.findByUsername(body.username);
		
		const passwordCorrect = user === null ?
			false :
			await userService.passwordMatches(user, body.password);

		if (!(user && passwordCorrect === true)) {
			return res.status(401).send({ error: 'invalid username or password' })
		} else {
			const userForToken = {
				username: user.get('username'),
				id: user.get('id')
			};

			const token = jwt.sign(userForToken, process.env.SECRET);

			res.status(200).send({
				token,
				username: user.get('username'),
				name: user.get('name')
			});
		}
	});

export default route;