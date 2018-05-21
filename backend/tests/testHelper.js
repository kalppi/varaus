
let _api = null, _token = null;

export const login = async (api) => {
	_api = api;

	const data = await api.post('/api/login').send({username: 'test', password: 'test'});

	_token = data.body.token;
};

export const get = (uri) => {
	return _api.get(uri).set('Authorization', 'Bearer ' + _token);
};

export const post = (uri) => {
	return _api.post(uri).set('Authorization', 'Bearer ' + _token);
};

export const put = (uri) => {
	return _api.put(uri).set('Authorization', 'Bearer ' + _token);
};

export const del = (uri) => {
	return _api.delete(uri).set('Authorization', 'Bearer ' + _token);
};