import axios from 'axios';

const base = '/api/history';

const getForBooking = (id) => {
	const request = axios.get(`${base}/${id}`);
	return request.then(response => response.data);
};