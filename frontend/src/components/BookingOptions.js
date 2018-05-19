import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as FA from 'react-icons/lib/fa';

import './css/BookingOptions.css';

class BookingOptions extends Component {
	render() {
		console.log(this.props.history)

		return <div id='booking-options'>
			<button className='btn' onClick={this.props.cancel}>cancel</button>

			<h5>Actions:</h5>
			<div>
				<button className='btn delete'><FA.FaTrash className='icon' /> Delete booking</button>
			</div>

			<h5>History:</h5>
			<table className='table'>

			</table>
		</div>;
	}
}

export default connect((state) => {
	return {
		history: state.overlay.bookingInfo.history
	}
}, {
	
})(BookingOptions);