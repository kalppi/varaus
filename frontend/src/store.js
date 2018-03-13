import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import appReducer from './reducers/appReducer';
import bookingsReducer from './reducers/bookingsReducer';
import itemsReducer from './reducers/itemsReducer';

const reducer = combineReducers({
	app: appReducer,
	bookings: bookingsReducer,
	items: itemsReducer
});

const store = createStore(
	reducer,
	applyMiddleware(thunk)
);

export default store;