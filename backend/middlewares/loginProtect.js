import jwt from 'jsonwebtoken';
import userService from '../services/user';

const getToken = (req) => {
	const authorization = req.get('authorization');

	if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7);
	} else {
		return null;
	}
};

const checkWhitelist = (req, res, whitelist, next) => {
	if(whitelist.includes(req.originalUrl)) {
		next();
	} else {
		res.status(401).end();
	}
};

export default (options) => {
	return async (req, res, next) => {
		try {
			const token = getToken(req);
			const decodedToken = jwt.verify(token, process.env.SECRET);

			if(token && decodedToken.id) {
				const user = await userService.getOne(decodedToken.id);

				req.user = user;

				next();
			} else {
				checkWhitelist(req, res, options.whitelist, next);
			}
		} catch (e) {
			if(e.name === 'JsonWebTokenError') {
				checkWhitelist(req, res, options.whitelist, next);
			} else {
				res.status(500).end();
			}
		}
	};
};