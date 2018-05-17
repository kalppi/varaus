import React, { Component } from 'react';
import * as FA from 'react-icons/lib/fa';

import './css/BookingOptions.css';

export default class BookingOptions extends Component {
	render() {
		return <div id='booking-options'>
			<button className='btn' onClick={this.props.cancel}>cancel</button>

			<h5>Actions:</h5>
			<div>
				<button className='btn delete'><FA.FaTrash className='icon' /> Delete booking</button>
			</div>
		</div>;
	}
}