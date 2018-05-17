import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogicMiddleware } from 'redux-logic';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import appReducer from './reducers/appReducer';
import bookingsReducer from './reducers/bookingsReducer';
import itemsReducer from './reducers/itemsReducer';
import overlayReducer from './reducers/overlayReducer';
import infoLogic from './logic/InfoLogic';
import BookingsLogic from './logic/BookingsLogic';

const reducer = combineReducers({
	app: appReducer,
	bookings: bookingsReducer,
	items: itemsReducer,
	overlay: overlayReducer
});

const logic = createLogicMiddleware([].concat(infoLogic).concat(BookingsLogic));

const store = createStore(
	reducer,
	applyMiddleware(thunk, multi, logic)
);

export default store;