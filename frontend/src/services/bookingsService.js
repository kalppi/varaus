import axios from 'axios';
import { formatDateDb } from '../utils';

const base = '/api/booking';

const getAll = () => {
	const request = axios.get(base);
	return request.then(response => response.data);
};

const getAllBetween = (start ,end) => {
	const request = axios.get(base, {params: { start: formatDateDb(start), end: formatDateDb(end) }});
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

const getHistory = (id) => {
	const request = axios.get(`${base}/${id}/history`);
	return request.then(response => response.data);
};

export default { getAll, getAllBetween, getOne, create, delete: del, search, getHistory };