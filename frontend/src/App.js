import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookingTable from './components/BookingTable';
import Info from './components/Info';
import Nav from './components/Nav';
import Minimap from './components/Minimap';
import { selectBooking } from './reducers/appReducer';
import { loadBookings } from './reducers/bookingsReducer';
import { loadItems } from './reducers/itemsReducer';
import './App.css';

class App extends Component {
	componentDidMount() {
		this.props.loadItems();
		this.props.loadBookings();
	}

	render() {
		return <div>
			<Nav />
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-md-3'>
						<Info />
					</div>
					<div className='col-md-9 nopadding'>
						<Minimap />
						<BookingTable />
					</div>
				</div>
			</div>
		</div>;
	}
}

export default connect((state) => {
	return {
		//showInfo: state.app.selectedBooking !== null || state.app.selection !== null
	};
}, {
	loadBookings, loadItems, selectBooking
})(App);
