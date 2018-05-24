import itemService from '../services/itemService';

export default (state = [], action) => {
	switch(action.type) {
		case 'INIT_ITEMS':
			return [...action.data];
		case 'ADD_ITEM':
			return [...state, action.data];
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
		});
	};
};

export const createItem = (data) => {
	return async (dispatch) => {
		const item = await itemService.create(data);

		dispatch({
			type: 'ADD_ITEM',
			data: item
		});
	};
};

export const moveUp = (id) => {
	return async (dispatch) => {
		await itemService.moveUp(id);

		const items = await itemService.getAll();
		
		dispatch({
			type: 'INIT_ITEMS',
			data: items
		});
	};
}

export const moveDown = (id) => {
	return async (dispatch) => {
		await itemService.moveDown(id);

		const items = await itemService.getAll();
		
		dispatch({
			type: 'INIT_ITEMS',
			data: items
		});
	};
}