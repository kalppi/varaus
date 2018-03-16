import bookingService from '../services/bookingService';
import moment from 'moment';

const initialState = () => {
	return {
		selectedBooking: null,
		selection: null,
		infoValues: {}
	};
};

export default (state = initialState(), action) => {
	switch(action.type) {
		case 'CLEAR_ALL_SELECTION':
			return {...state, selection: null, selectedBooking: null};
		case 'SELECT_BOOKING':
			return {...state, selectedBooking: action.data.booking };
		case 'SET_SELECTION_INFO':
			return {...state, selection: action.data};
		case 'SET_INFO_VALUES':
			return {...state, infoValues: { ...state.infoValues, ...action.data }};
		case 'CLEAR_INFO_VALUES':
			return {...state, infoValues: {}};
		default:
			return state;
	}
};

export const selectBooking = (booking) => {
	return async (dispatch, getState) => {
		if(!booking) {
			dispatch([{
				type: 'SELECT_BOOKING',
				data: { booking: null }
			}, clearInfoValues()]);
		} else {
			/*dispatch({
				type: 'CLEAR_ALL_SELECTION'
			});*/

			const selected = await bookingService.getOne(booking.id);
			let infoValues = {};

			if(selected) {
				infoValues = {
					item: {
						text: selected.Item.name,
						value: selected.Item.id
					},
					start: selected.start,
					end: selected.end,
					nights: moment(selected.end, 'YYYY-MM-DD').diff(moment(selected.start, 'YYYY-MM-DD'), 'days'),
					name: selected.UserInfo.name,
					email: selected.UserInfo.email
				};
			}

			dispatch([{
				type: 'SELECT_BOOKING',
				data: { booking: selected }
			}, {
				type: 'SET_INFO_VALUES',
				data: infoValues
			}]);
			
		}
	};
};

export const setSelectionInfo = (item, start, end) => {
	const values = {
		item: item.name,
		start: start,
		end: end,
		nights: moment(end, 'YYYY-MM-DD').diff(moment(start, 'YYYY-MM-DD'), 'days'),
	};

	return [{
		type: 'SET_SELECTION_INFO',
		data: { item, start, end }
	}, {
		type: 'SET_INFO_VALUES',
		data: values
	}];
};

export const clearSelectionInfo = () => {
	return {
		type: 'SET_SELECTION_INFO',
		data: null
	}
};

export const setInfoValues = (values) => {
	return {
		type: 'SET_INFO_VALUES',
		data: values
	}
};

export const clearInfoValues = () => {
	return {
		type: 'CLEAR_INFO_VALUES'
	};
};