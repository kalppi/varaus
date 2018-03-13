import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import bookingsReducer from './reducers/bookingsReducer';

const reducer = combineReducers({
	bookings: bookingsReducer
});

const store = createStore(
	reducer,
	applyMiddleware(thunk)
);

export default store;