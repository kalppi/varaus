import './env-check';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bookingRoute from './controllers/booking';
import itemRoute from './controllers/item';
import customerRoute from './controllers/customer';
import loginRoute from './controllers/login';
import loginProtect from './middlewares/loginProtect';
import { logger } from './middlewares/logger';
import { log } from './utils';
import { sequelize } from './models';

let port = null

switch(process.env.NODE_ENV) {
	case 'test':
		port = process.env.TEST_PORT;
		break;
	case 'dev':
		sequelize.sync();
		port = process.env.DEV_PORT;	
		break;
	case 'production':
		sequelize.sync();
		port = process.env.PORT;
		break;
	default:
		process.exit(1);
}

if(port === null) {
	console.log('Error: port not specified');
	process.exit(1);
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

if(process.env.NODE_ENV !== 'test') {
	app.use(logger({
		'/api/item': out => {
			if(Array.isArray(out)) {
				return out.map(item => {
					return {
						id: item.id,
						name: item.name
					};
				});
			} else {
				return out;
			}
		},
		'/api/booking': out => {
			if(Array.isArray(out)) {
				return out.map(item => {
					return {
						id: item.id,
						start: item.start,
						end: item.end,
						customer: item.Customer.name
					};
				});
			} else {
				return out;
			}
		}
	}));
}

app.use(loginProtect({whitelist: ['/api/login']}));

app.use('/api/booking', bookingRoute);
app.use('/api/item', itemRoute);
app.use('/api/customer', customerRoute);
app.use('/api/login', loginRoute);

const server = app.listen(port, () => {
	log(`Server running on port ${port}`);
});

server.on('close', () => {
	sequelize.close();
});

export { app, server };