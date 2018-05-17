import userService from '../services/userService';

const initialState = () => {
	return {
		overlay: {},
		customers: []
	};
};

export default (state = initialState(), action) => {
	switch(action.type) {
		case 'SET_OVERLAY':
			return {...state, overlay: { ...action.data }};
		case 'SET_CUSTOMERS':
			return {...state, customers: action.data};
		default:
			return state;
	}
};

export const showCustomersOverlay = () => {
	return async (dispatch, getState) => {
		const customers = await userService.getAll();

		const p = new Promise((resolve, reject) => {
			dispatch([{
				type: 'SET_OVERLAY',
				data: { visible: true, resolve, reject, type: 'customers' }
			}, {
				type: 'SET_CUSTOMERS',
				data: customers
			}]);
		});

		return p;
	}
};

export const showOptionsOverlay = () => {
	return async (dispatch, getState) => {
		const p = new Promise((resolve, reject) => {
			dispatch([{
				type: 'SET_OVERLAY',
				data: { visible: true, resolve, reject, type: 'options' }
			}]);
		});

		return p;
	}
};

export const hideOverlay = () => {
	return {
		type: 'SET_OVERLAY',
		data: { visible: false }
	};
};