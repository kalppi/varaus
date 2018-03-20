import { createLogic } from 'redux-logic';
import Search from 'js-easy-text-search';

const search = new Search({
	field: 'search',
	wildPrefix: false,
	wildSuffix: true
});

export default [createLogic({
	type: 'INIT_BOOKINGS',
	processOptions: {
		dispatchReturn: true
	},

	process({getState, action}) {
		const { bookings } = getState();

		for(let booking of bookings) {
			search.add({
				search: booking.UserInfo.name,
				bookingId: booking.id
			});
		}
	}
}), createLogic({
	type: 'SET_SEARCH_QUERY',
	processOptions: {
		dispatchReturn: true
	},

	process({getState, action}) {
		const { searchQuery } = getState().app;
		const results = search.search(searchQuery + '*');

		return {
			type: 'SET_SEARCH_RESULTS',
			data: results
		}
	}
})];