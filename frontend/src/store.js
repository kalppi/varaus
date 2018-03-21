import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import appReducer from './reducers/appReducer';
import bookingsReducer from './reducers/bookingsReducer';
import itemsReducer from './reducers/itemsReducer';
import infoLogic from './logic/InfoLogic';
import BookingTableLogic from './logic/BookingTableLogic';

const reducer = combineReducers({
	app: appReducer,
	bookings: bookingsReducer,
	items: itemsReducer
});

const logic = createLogicMiddleware([].concat(infoLogic).concat(BookingTableLogic));

const store = createStore(
	reducer,
	applyMiddleware(thunk, multi, logic)
);

export default store;