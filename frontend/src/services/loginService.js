import axios from 'axios';
import { setToken } from './serviceHelper';

const base = '/api/login';

const login = async (username, password) => {
	const request = await axios.post(base, { username, password }).then(response => response.data);
	setToken(axios, request.token);

	return request;
};

export default { login };