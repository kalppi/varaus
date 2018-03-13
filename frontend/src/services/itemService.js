import axios from 'axios';

const base = '/api/item';

const getAll = () => {
	const request = axios.get(base)
	return request.then(response => response.data);
}

export default { getAll };