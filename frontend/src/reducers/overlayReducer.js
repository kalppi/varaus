import customerService from '../services/customerService';
import bookingService from '../services/bookingsService';

const initialState = () => {
	return {
		overlay: {},
		customers: [],
		bookingInfo: null
	};
};

export default (state = initialState(), action) => {
	switch(action.type) {
		case 'SET_OVERLAY':
			return {...state, overlay: { ...action.data }};
		case 'SET_CUSTOMERS':
			return {...state, customers: action.data};
		case 'SET_BOOKING_INFO':
			return {...state, bookingInfo: action.data};
		default:
			return state;
	}
};

export const showCustomersOverlay = () => {
	return async (dispatch, getState) => {
		const customers = await customerService.getAll();

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

export const showManagementOverlay = () => {
	return async (dispatch, getState) => {
		const p = new Promise((resolve, reject) => {
			dispatch([{
				type: 'SET_OVERLAY',
				data: { visible: true, resolve, reject, type: 'management' }
			}]);
		});

		return p;
	}
};

export const showOptionsOverlay = (booking) => {
	return async (dispatch, getState) => {
		const history = await bookingService.getHistory(booking.id);

		const p = new Promise((resolve, reject) => {
			dispatch([{
				type: 'SET_BOOKING_INFO',
				data: { booking, history }
			}, {
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