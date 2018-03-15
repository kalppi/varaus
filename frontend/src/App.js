import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookingTable from './components/BookingTable';
import Info from './components/Info';
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
		return (
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-md-3'>
						<Info />
					</div>
					<div className='col-md-7 nopadding'>
						<BookingTable />
					</div>
					<div className='col-md-2'>
						
					</div>
				</div>
			</div>
		);
	}
}

export default connect(null, {
	loadBookings, loadItems, selectBooking
})(App);
