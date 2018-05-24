import { createLogic } from 'redux-logic';
import bookingsService from '../services/bookingsService';

export default [createLogic({
	type: 'DELETE_BOOKING',

	async process({getState, action}, dispatch, done) {
		if(window.confirm('Are you sure?')) {
			await bookingsService.delete(action.data.id);

			dispatch({
				type: 'DELETE_BOOKING_SUCCESS',
				data: { id: action.data.id }
			});

			dispatch({
				type: 'CLEAR_ALL_SELECTION'
			});

			done();
		}
	}
})];