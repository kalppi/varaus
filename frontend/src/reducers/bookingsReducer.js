import bookingsService from '../services/bookingsService';

export default (state = [], action) => {
	switch(action.type) {
		case 'INIT_BOOKINGS':
			return [...action.data];
		case 'ADD_BOOKING':
			return [...state, action.data];
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
		});
	};
};

export const createBooking = (data) => {
	return async (dispatch) => {
		const booking = await bookingsService.create(data);

		dispatch({
			type: 'CLEAR_ALL_SELECTION'
		});

		dispatch({
			type: 'ADD_BOOKING',
			data: booking
		});
	};
};