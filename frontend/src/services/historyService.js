import axios from 'axios';
import { formatDateDb } from '../utils';

const base = '/api/history';

const getAll = () => {
	const request = axios.get(base);
	return request.then(response => response.data);
};

export default { getAll };