import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bookingRoute from './controllers/booking';

let port = process.env.PORT;

if (process.env.NODE_ENV === 'test') {
	port = process.env.TEST_PORT;
}

if(port === undefined) {
	console.log('Error: port not specified');

	process.exit(1);
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/booking', bookingRoute);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});