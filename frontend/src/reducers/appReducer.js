
export default (state = {}, action) => {
	switch(action.type) {
		case 'SELECT_BOOKING':
			return {...state, selectedBooking: action.data.booking};
		default:
			return state;
	}
};


export const selectBooking = (booking) => {
	return {
		type: 'SELECT_BOOKING',
		data: { booking }
	};
};