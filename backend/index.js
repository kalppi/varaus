import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bookingRoute from './controllers/booking';
import itemRoute from './controllers/item';
import customerRoute from './controllers/customer';
import loginRoute from './controllers/login';
import loginProtect from './middlewares/loginProtect';
import { log } from './utils';
import { sequelize } from './models';

let port = process.env.PORT;

if (process.env.NODE_ENV === 'test') {
	port = process.env.TEST_PORT;
} else {
	sequelize.sync();
}

if(port === undefined) {
	console.log('Error: port not specified');

	process.exit(1);
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

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