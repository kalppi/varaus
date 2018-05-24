import './env-check';

import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bookingRoute from './controllers/booking';
import itemRoute from './controllers/item';
import customerRoute from './controllers/customer';
import loginRoute from './controllers/login';
import loginProtect from './middlewares/loginProtect';
import logger from 'logger';
import { log } from './utils';
import { sequelize } from './models';
import userService from './services/user';

let port = null

switch(process.env.NODE_ENV) {
	case 'test':
		port = process.env.TEST_PORT;
		break;
	case 'dev':
		port = process.env.DEV_PORT;	
		break;
	case 'production':
		port = process.env.PORT;
		break;
	default:
		process.exit(1);
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

if(process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'frontend')));
}

if(process.env.NODE_ENV === 'dev') {
	app.use(logger({
		colors: {
			request: 'redBright',
			response: 'greenBright'
		}
	}));
}

app.use(loginProtect({whitelist: ['/', '/api/login']}));

app.use('/api/booking', bookingRoute);
app.use('/api/item', itemRoute);
app.use('/api/customer', customerRoute);
app.use('/api/login', loginRoute);

const server = app.listen(port, async () => {
	log(`Server running on port ${port}`);

	if (process.env.NODE_ENV !== 'test') {
		await sequelize.sync();

		const count = await userService.count();

		if(count === 0) {
			log('No users found, creating a default user');

			userService.create('Default user', 'default', 'default');
		}
	}
});

server.on('close', () => {
	sequelize.close();
});

export { app, server };