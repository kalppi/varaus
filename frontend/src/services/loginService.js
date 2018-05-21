import axios from 'axios';

const base = '/api/login';

const login = async (username, password) => {
	const request = await axios.post(base, { username, password }).then(response => response.data);
	return request;
};

const logout = async () => {
	const request = await axios.get(`${base}/logout`).then(response => response.data);
	return request;
};

export default { login, logout };