import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BookingTable.css';

class BookingTable extends Component {
	render() {
		const rows = ['aaa', 'bbb', 'ccc'];

		const dates = [];
		for(let i = 0; i < 10; i++) {
			dates.push(i);
		}

		return <table id='bookings'>
		<tbody>
		 { rows.map(row => 
		 		<tr key={row}>
		 			{ dates.map(date => [
		 					<td key={`${date}-left`}  className='day-left'>
		 						{`${date}-l`}
		 					</td>,
		 					<td key={`${date}-right`} className='day-right'>
		 						{`${date}-r`}
		 					</td>
		 					]
		 			)}
		 		</tr>
		 )}
		</tbody>
		</table>;
	}
}


export default connect((state) => {
	return {
		bookings: state.bookings
	}
})(BookingTable);