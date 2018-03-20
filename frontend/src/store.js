import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import appReducer from './reducers/appReducer';
import bookingsReducer from './reducers/bookingsReducer';
import itemsReducer from './reducers/itemsReducer';
import infoLogic from './logic/InfoLogic';
import BookingTableLogic from './logic/BookingTableLogic';
import SearchLogic from './logic/SearchLogic';

const reducer = combineReducers({
	app: appReducer,
	bookings: bookingsReducer,
	items: itemsReducer
});

const logic = createLogicMiddleware([].concat(infoLogic).concat(BookingTableLogic).concat(SearchLogic));

const store = createStore(
	reducer,
	applyMiddleware(thunk, multi, logic)
);

export default store;