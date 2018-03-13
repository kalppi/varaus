import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './BookingTable.css';

class BookingTable extends Component {
	constructor(props) {
		super(props);

		this.cells = {};
	}

	getCell(itemId, date, lr) {
		const id = `${itemId}-${date.format('YYYY-MM-DD')}-${lr}`;
		return this.cells[id];
	}

	componentDidUpdate() {
		for(let booking of this.props.bookings) {
			let cell = this.getCell(booking.ItemId, booking.m_start, 'right');

			if(cell) {
				cell.colSpan = booking.length * 2;
				cell.className += ' booking';
			} else {
				continue;
			}

			const date = moment(booking.m_start);
			const end = moment(booking.m_end).subtract(1, 'days');

			while(date.isBefore(end)) {
				date.add(1, 'day');

				cell = this.getCell(booking.ItemId, date, 'left');
				if(cell) {
					cell.innerHTML = '#';
					cell.style.display = 'none';

					cell = this.getCell(booking.ItemId, date, 'right');
					cell.innerHTML = '#';
					cell.style.display = 'none';
					
				} else {
					break;
				}
			}

			date.add(1, 'day');

			cell = this.getCell(booking.ItemId, date, 'left');
			if(cell) {
				cell.innerHTML = '#';
				cell.style.display = 'none';
			}
		}
	}

	render() {
		for(let booking of this.props.bookings) {
			booking.m_start = moment(booking.start, 'YYYY-MM-DD');
			booking.m_end = moment(booking.end, 'YYYY-MM-DD');
			booking.length = booking.m_end.diff(booking.m_start, 'days');
		}

		const weekNumbers = [];
		const dates = [];
		const date = moment(this.props.startDate);

		for(let i = 0; i < 10; i++) {
			dates.push({
				text: date.format('DD.MM.'),
				full: date.format('YYYY-MM-DD'),
				date: moment(date)
			});
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

		return <table id='bookings' ref={ref => this.table = ref}>
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
					{ date.text }
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
	 				dates.map(date => {
	 					return [
	 						<td key={`${date.text}-left`}  className='day-left' ref={ref => this.cells[`${item.id}-${date.full}-left`] = ref}>
	 							
	 						</td>,
	 						<td key={`${date.text}-right`} className='day-right' ref={ref => this.cells[`${item.id}-${date.full}-right`] = ref}>

	 						</td>
	 						]
	 				})
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