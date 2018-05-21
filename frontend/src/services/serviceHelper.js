import axios from 'axios';

export const setToken = (user) => {
	axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;

	window.localStorage.setItem('user', JSON.stringify(user));
};

export const removeToken = () => {
	axios.defaults.headers.common['Authorization'] = null;

	window.localStorage.removeItem('user');
};