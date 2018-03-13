import bookingsService from '../services/bookingsService';

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
		const bookings = await bookingsService.getAll();

		dispatch({
			type: 'INIT_BOOKINGS',
			data: bookings
		})
	};
};