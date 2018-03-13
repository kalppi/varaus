import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookingTable from './components/BookingTable';
import { loadBookings } from './reducers/bookingsReducer';

class App extends Component {
	componentDidMount() {
		this.props.loadBookings();	
	}

	render() {
		return (
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-md-2'>
						
					</div>
					<div className='col-md-8'>
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
	loadBookings
})(App);