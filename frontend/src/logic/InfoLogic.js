import { createLogic } from 'redux-logic';
import bookingsService from '../services/bookingsService';

const hasChanged = (selected, values) => {
	if(values.item === undefined) return false;

	const changed = [];

	if(values.item.value !== selected.ItemId) changed.push('item');
	if(values.start.value.format('YYYY-MM-DD') !== selected.start) changed.push('start');
	if(values.end.value.format('YYYY-MM-DD') !== selected.end) changed.push('end');
	if(values.name !== selected.UserInfo.name) changed.push('name');
	if(values.email !== selected.UserInfo.email) changed.push('email');

	return changed.length > 0;
};

const validValues = (values) => {
	const errors = [];

	const { name = "", email = "", start, end  } = values;

	if(name.length === 0) errors.push('name');
	if(email.length < 5 || email.indexOf('@') === -1) errors.push('email');
	if(!start.value.isValid()) errors.push('start');
	if(!end.value.isValid()) errors.push('end');

	if(errors.length === 0) {
		return { isValid: true };
	} else {
		return { isValid: false, errors };
	}
}

export default [createLogic({
	type: 'SET_INFO_VALUES',
	processOptions: {
		dispatchReturn: true
	},

	process({getState, action}) {
		const state = getState();
		const { infoValues, selectedBooking, selection } = state.app;

		let buttonEnabled = false;

		if(infoValues) {
			if(selectedBooking) {
				const changed = hasChanged(selectedBooking, infoValues);

				if(changed) {
					const valid = validValues(infoValues);
					buttonEnabled = valid.isValid;
				}
			} else if(selection) {
				const valid = validValues(infoValues);
				buttonEnabled = valid.isValid;
			}
		}

		return {
			type: 'SET_BUTTON_ENABLED',
			data: buttonEnabled
		};
	}
}), createLogic({
	type: 'DELETE_BOOKING',

	process({getState, action}, dispatch, done) {
		if(window.confirm('Are you sure?')) {
			bookingsService.delete(action.data.id);

			dispatch({
				type: 'DELETE_BOOKING_SUCCESS',
				data: { id: action.data.id }
			});

			done();
		}
	}
})];