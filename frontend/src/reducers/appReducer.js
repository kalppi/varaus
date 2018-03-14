import bookingService from '../services/bookingService';

export default (state = {}, action) => {
	switch(action.type) {
		case 'SELECT_BOOKING':
			return {...state, selectedBooking: action.data.booking};
		default:
			return state;
	}
};

export const selectBooking = (booking) => {
	return async (dispatch) => {
		if(!booking) {
			dispatch({
				type: 'SELECT_BOOKING',
				data: { booking: null }
			});
		} else {
			const fullBooking = await bookingService.getOne(booking.id);
			
			dispatch({
				type: 'SELECT_BOOKING',
				data: { booking: fullBooking }
			});
		}
	};
};