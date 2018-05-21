
export const setToken = (axios, token) => {
	axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};