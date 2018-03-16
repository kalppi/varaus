import bookingService from '../services/bookingService';

const initialState = () => {
	return {
		selectedBooking: null,
		selection: null,
		buttonEnabled: false,
		changed: false
	};
};

export default (state = initialState(), action) => {
	switch(action.type) {
		case 'CLEAR_ALL_SELECTION':
			return {...state, selection: null, selectedBooking: null};
		case 'SELECT_BOOKING':
			return {...state, selectedBooking: action.data.booking};
		case 'SET_SELECTION_INFO':
			return {...state, selection: action.data};
		case 'SET_BUTTON_ENABLED':
			return {...state, buttonEnabled: action.data.enabled};
		case 'SET_IS_CHANGED':
			return {...state, changed: action.data.changed};
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
			dispatch({
				type: 'CLEAR_ALL_SELECTION'
			});

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

export const clearSelectionInfo = () => {
	return {
		type: 'SET_SELECTION_INFO',
		data: null
	}
};

export const setButtonEnabled = (enabled) => {
	return {
		type: 'SET_BUTTON_ENABLED',
		data: { enabled }
	}
};

export const setIsChanged = (changed) => {
	const actions = [{
		type: 'SET_IS_CHANGED',
		data: { changed }
	}];

	if(changed) {
		actions.push(setButtonEnabled(true));
	} else {
		actions.push(setButtonEnabled(false));
	}

	return actions;
};