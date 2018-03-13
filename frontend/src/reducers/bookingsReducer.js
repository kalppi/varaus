import bookingService from '../services/bookingService';

export default (state = [], action) => {
	switch(action.type) {
		case 'INIT_BOOKINGS':
			return [...action.data];
		default:
			return state;
	}
};

export const loadBookings = () => {
	return async (dispatch) => {
		const bookings = await bookingService.getAll();

		dispatch({
			type: 'INIT_BOOKINGS',
			data: bookings
		})
	};
};