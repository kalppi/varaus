import bookingService from '../services/bookingService';

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
		const bookings = await bookingService.getAll();
		
		dispatch({
			type: 'INIT_BOOKINGS',
			data: bookings
		})
	};
};

export const createBooking = (data) => {
	return async (dispatch) => {
		const booking = await bookingService.create(data);

		dispatch({
			type: 'CLEAR_ALL_SELECTION'
		});

		dispatch({
			type: 'ADD_BOOKING',
			data: booking
		});
	};
};