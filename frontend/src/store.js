import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import bookingsReducer from './reducers/bookingsReducer';
import itemsReducer from './reducers/itemsReducer';

const reducer = combineReducers({
	bookings: bookingsReducer,
	items: itemsReducer
});

const store = createStore(
	reducer,
	applyMiddleware(thunk)
);

export default store;