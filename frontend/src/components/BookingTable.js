import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './BookingTable.css';

class BookingTable extends Component {
	render() {
		const weekNumbers = [];
		const dates = [];
		const date = moment(this.props.startDate);

		for(let i = 0; i < 10; i++) {
			dates.push(date.format('DD.MM.'));
			weekNumbers.push(date.isoWeek());
			date.add(1, 'day');
		}

		const WeekNumberColumns = weekNumbers.reduce((acc, value) => {
			if(acc.length === 0) {
				return [{
					number: value,
					count: 1
				}];
			}

			const last = acc[acc.length - 1];

			if(last.number === value) {
				last.count++;
			} else {
				acc.push({
					number: value,
					count: 1
				});
			}

			return acc;
		}, []);

		return <table id='bookings'>
		<thead>
		<tr>
			{[<th key='empty'></th>,
			WeekNumberColumns.map(week => [
				<th colSpan={ week.count * 2 } key={`${week}`}  className='day-left'>
					{ week.number }
				</th>,
				]
			)
			]}
		</tr>
		<tr>
			{[<th key='empty'></th>,
			dates.map(date => [
				<th colSpan='2' key={`${date}-left`}  className='day-left'>
					{ date }
				</th>,
				]
			)
			]}
		</tr>
		</thead>
		<tbody>
		 { this.props.items.map(item => 
	 		<tr key={item.id}>
	 			{[
	 				<td key={item.id} className='item-name'>
	 					{item.name}
	 				</td>,
	 				dates.map(date => [
 						<td key={`${date}-left`}  className='day-left'>
 							
 						</td>,
 						<td key={`${date}-right`} className='day-right'>

 						</td>
 						]
	 				)
	 			]}
	 		</tr>
		 )}
		</tbody>
		</table>;
	}
}


export default connect((state) => {
	return {
		bookings: state.bookings,
		items: state.items,
		startDate: moment('20181011', 'YYYYMMDD')
	}
})(BookingTable);