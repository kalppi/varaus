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
		const id = `cell-${itemId}-${date}-${lr}`;
		return this.cells[id];
	}

	componentDidUpdate() {
		for(let booking of this.props.bookings) {
			const length = moment(booking.end, 'YYYY-MM-DD').diff(moment(booking.start, 'YYYY-MM-DD'), 'days');

			let id = `cell-${booking.ItemId}-${booking.start}-right`;

			if(this.cells[id]) {
				this.cells[id].colSpan = length * 2;
				this.cells[id].className += ' booking';
			}
/*
			id = `cell-${booking.ItemId}-${booking.end}-left`;

			if(this.cells[id]) {
				this.cells[id].innerHTML = 'E';
			}*/

			const date = moment(booking.start, 'YYYY-MM-DD');
			const end = moment(booking.end, 'YYYY-MM-DD').subtract(1, 'days');

			while(date.isBefore(end)) {
				date.add(1, 'day');

			//	console.log(date.format('YYYY-MM-DD') + " / " + end.format('YYYY-MM-DD'))

				let cell = this.getCell(booking.ItemId, date.format('YYYY-MM-DD'), 'left');
				if(cell) {
					cell.innerHTML = '#';
					cell.style.display = 'none';
				}

				cell = this.getCell(booking.ItemId, date.format('YYYY-MM-DD'), 'right');
				if(cell) {
					cell.innerHTML = '#';
					cell.style.display = 'none';
				}
			}

			date.add(1, 'day');

			let cell = this.getCell(booking.ItemId, date.format('YYYY-MM-DD'), 'left');
			if(cell) {
				cell.innerHTML = '#';
				cell.style.display = 'none';
			}
		}
	}

	render() {
		console.log(this.props.bookings)

		const weekNumbers = [];
		const dates = [];
		const date = moment(this.props.startDate);

		/*
		const getBookingAtDate = (date, item) => {
			const booking = this.props.bookings.find(b =>
				b.ItemId === item.id && b.start === date.compare);

			if(booking) return booking;
			else return null;
		};

		const getBookingAtDate2 = (date, item) => {
			for(let booking of this.props.bookings) {
				if(booking.ItemId === item.id && date.isBetween(
					moment(booking.start, 'YYYY-MM-DD'),
					moment(booking.end, 'YYYY-MM-DD'),
					null,
					'[]'
				)) {
					
					console.log(booking.start + "-" + booking.end + " / " + date.format('YYYY-MM-DD'))
					return true;
				}
			}
			
			return false;
		};*/

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

/*
		const rows = [];

		for(let item of this.props.items) {
			const row = [];

			for(let date of dates) {
				const booking = getBookingAtDate(date.date, item);

				row.push({
					key: date.text,
					booking: booking ? 1 : null
				});
			}

			rows.push({
				text: item.name,
				key: item.id,
				data: row
			});
		}*/

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
		 { 
/*
		 	rows.map(row =>
		 		<tr key={row.key}>
		 		 {
		 		 	[<td key={row.key} className='item-name'>
		 		 		{ row.text }
		 		 	</td>,
		 		 	row.data.map(cell =>
		 		 		[
		 		 		<td key={cell.key + 'l'} className='day-left'>{cell.booking}</td>,
		 		 		<td key={cell.key + 'r'} className='day-right'>{cell.booking}</td>
		 		 		])
		 		 	]
		 		 }
		 		</tr>)*/


		 this.props.items.map(item => 
	 		<tr key={item.id}>
	 			{[
	 				<td key={item.id} className='item-name'>
	 					{item.name}
	 				</td>,
	 				dates.map(date => {
	 					return [
	 						<td key={`${date.text}-left`}  className='day-left' ref={ref => this.cells[`cell-${item.id}-${date.full}-left`] = ref}>
	 							
	 						</td>,
	 						<td key={`${date.text}-right`} className='day-right' ref={ref => this.cells[`cell-${item.id}-${date.full}-right`] = ref}>

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