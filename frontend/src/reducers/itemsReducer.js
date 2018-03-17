import itemService from '../services/itemService';

export default (state = [], action) => {
	switch(action.type) {
		case 'INIT_ITEMS':
			return [...action.data];
		default:
			return state;
	}
};

export const loadItems = () => {
	return async (dispatch) => {
		const items = await itemService.getAll();
		
		dispatch({
			type: 'INIT_ITEMS',
			data: items
		})
	};
};