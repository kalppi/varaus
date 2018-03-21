import axios from 'axios';

const base = '/api/booking';

const getAll = () => {
	const request = axios.get(base);
	return request.then(response => response.data);
};

const getOne = (id) => {
	const request = axios.get(`${base}/${id}`);
	return request.then(response => response.data);
};

const create = (data) => {
	const request = axios.post(`${base}`, data);
	return request.then(response => response.data);
};

const del = (id) => {
	const request = axios.delete(`${base}/${id}`);
	return request.then(response => response.data);
};

const search = (query) => {
	const request = axios.get(`${base}/search`, { params: { query: query } });
	return request.then(response => response.data);
};

export default { getAll, getOne, create, delete: del, search };