import axios from 'axios';

const base = '/api/item';

const getAll = () => {
	const request = axios.get(base)
	return request.then(response => response.data);
};

const create = (data) => {
	const request = axios.post(base, data);
	return request.then(response => response.data);
};

const update = (id, data) => {
	const request = axios.put(`${base}/${id}`, data);
	return request.then(response => response.data);	
};

const moveUp = (id) => {
	const request = axios.post(`${base}/${id}/up`);
	return request.then(response => response.data);
};

const moveDown = (id) => {
	const request = axios.post(`${base}/${id}/down`);
	return request.then(response => response.data);
};

export default { getAll, create, update, moveUp, moveDown };