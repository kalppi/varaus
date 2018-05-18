const history = [];

const snapshot = () => {

};

const addChange = (id, change) => {

};

const addDelete = (oldBooking) => {

};

const addCreate = (newBooking) => {
	history.push({
		type: 'create',
		time: newBooking.get('createdAt'),
		booking: {
			id: newBooking.get('id'),
			start: newBooking.get('start'),
			end: newBooking.get('end'),
			ItemId: newBooking.get('ItemId'),
			UserId: newBooking.get('UserId')
		}
	});
};

const get = () => {
	return history;
};

const getForBooking = (id) => {
	return history.filter(h => h.booking.id == id);
};

const length = () => {
	return history.length;
};

const lengthForBooking = (id) => {
	return getForBooking(id).length;
};

const peek = () => {
	return history[history.length - 1];
};

const peekForBooking = (id) => {
	for(let i = history.length - 1; i >= 0; i--) {
		if(history[i].booking.id == id) {
			return history[i];
		}
	}

	return null;
};

export default { snapshot, addChange, addDelete, addCreate, get, getForBooking, length, lengthForBooking, peek, peekForBooking };