import bookingsService from '../services/bookingsService';

export default (state = [], action) => {
	switch(action.type) {
		case 'INIT_BOOKINGS':
			return [...action.data];
		case 'ADD_BOOKING':
			return [...state, action.data];
		case 'DELETE_BOOKING_SUCCESS':
			return state.filter(b => b.id !== action.data.id);
		case 'UPDATE_BOOKING':
			return [...state.filter(b => b.id !== action.data.id), action.data];
		default:
			return state;
	}
};

export const loadBookings = () => {
	return async (dispatch, getState) => {
		const { loadBounds } = getState().app;

		const bookings = await bookingsService.getAllBetween(loadBounds.start, loadBounds.end);

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

export const deleteBooking = (id) => {
	return {
		type: 'DELETE_BOOKING',
		data: { id }
	}
};

export const updateBooking = (id, data) => {
	return async (dispatch) => {
		await bookingsService.update(id, data);

		dispatch({
			type: 'CLEAR_ALL_SELECTION'
		});

		dispatch({
			type: 'UPDATE_BOOKING',
			data: data
		});
	};
};