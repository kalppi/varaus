const express = require('express');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

let port = process.env.PORT;

if (process.env.NODE_ENV === 'test') {
	port = process.env.TEST_PORT;
}

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});