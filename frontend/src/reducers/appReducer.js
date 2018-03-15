import bookingService from '../services/bookingService';

const initialState = () => {
	return {
		selectedBooking: null,
		selection: null
	};
};

export default (state = initialState(), action) => {
	switch(action.type) {
		case 'SELECT_BOOKING':
			return {...state, selectedBooking: action.data.booking};
		case 'SET_SELECTION_INFO':
			return {...state, selection: action.data};
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

export const setSelectionInfo = (item, start, end) => {
	return {
		type: 'SET_SELECTION_INFO',
		data: { item, start, end }
	};
};