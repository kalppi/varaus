import bookingsService from '../services/bookingsService';
import moment from 'moment';
import { formatDate } from '../utils';

const initialState = () => {
	return {
		selectedBooking: null,
		//selection: null,
		selection: {},
		infoValues: {},
		buttonEnabled: false,
		date: null,
		searchResults: [],
		loadBounds: null,
		minimapViewBounds: null
	};
};

export default (state = initialState(), action) => {
	switch(action.type) {
		case 'CLEAR_ALL_SELECTION':
			return {...state, selection: null, selectedBooking: null, infoValues: {}};
		case 'SELECT_BOOKING':
			return {...state, selectedBooking: action.data.booking, selection: null };
		case 'SET_SELECTION_INFO':
			return {...state, selection: action.data};
		case 'SET_INFO_VALUES':
			return {...state, infoValues: { ...state.infoValues, ...action.data }};
		case 'CLEAR_INFO_VALUES':
			return {...state, infoValues: {}};
		case 'SET_BUTTON_ENABLED':
			return {...state, buttonEnabled: action.data};

		case 'SET_SELECTION':
			return {...state, selection: {...state.selection, ...action.data}};


		case 'SET_DATE':
			const startDate = moment(action.data.date).add(-4, 'days');
			const endDate = moment(action.data.date).add(5, 'days');

			return {...state, date: action.data.date, startDate, endDate, loadBounds: action.data.loadBounds, minimapViewBounds: action.data.minimapViewBounds};


		case 'SET_SEARCH_RESULTS':
			return {...state, searchResults: action.data};

		default:
			return state;
	}
};

export const setDate = (date) => {
	return {
		type: 'SET_DATE',
		data: {
			date,
			loadBounds: {
				start: moment(date).add(-80, 'days'),
				end: moment(date).add(80, 'days')
			},
			minimapViewBounds: {
				start: moment(date).add(-40, 'days'),
				end: moment(date).add(40, 'days')
			}
		}
	}
};

export const unselectBooking = () => {
	return {
		type: 'SELECT_BOOKING',
		data: { booking: null }
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
			const selected = await bookingsService.getOne(booking.id);
			let infoValues = {};

			if(selected) {
				const start = moment(selected.start, 'YYYY-MM-DD');
				const end = moment(selected.end, 'YYYY-MM-DD');

				infoValues = {
					item: {
						text: selected.Item.name,
						value: selected.Item.id
					},
					start: {
						text: formatDate(start),
						value: start
					},
					end: {
						text: formatDate(end),
						value: end
					},
					nights: end.diff(start, 'days'),
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

export const setSelection = (info) => {
	return {
		type: 'SET_SELECTION',
		data: info
	}
};

export const setSelectionInfo = (item, start, end) => {
	const values = {
		item: {
			text: item.name,
			value: item.id
		},
		start: {
			text: formatDate(start),
			value: start
		},
		end: {
			text: formatDate(end),
			value: end
		},
		nights: end.diff(start, 'days'),
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

export const search = (query) => {
	return async (dispatch, getState) => {
		const results = await bookingsService.search(query);

		dispatch({
			type: 'SET_SEARCH_RESULTS',
			data: results
		});
	}
};