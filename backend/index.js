const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

let port = process.env.PORT;

if (process.env.NODE_ENV === 'test') {
	port = process.env.TEST_PORT;
}

if(port === undefined) {
	console.log('Error: port not specified');

	process.exit(1);
}

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});