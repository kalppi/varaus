import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import deepEqual from 'deep-equal';
import { selectBooking, setSelectionInfo, clearSelectionInfo } from '../reducers/appReducer';
import './BookingTable.css';

class BookingTable extends Component {
	constructor(props) {
		super(props);

		this.cells = {};
		this.selected = null;

		this.selectStart = null;
		this.selectEnd = null;
		this.selectedCells = [];

		this.oldStart = null;
		this.oldEnd = null;

		this.lastMouseMoveCell = null;
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.selectedBooking !== nextProps.selectedBooking) {
			const oldCell = this.getBookingCell(this.props.selectedBooking);
			const newCell = this.getBookingCell(nextProps.selectedBooking);

			if(oldCell) oldCell.classList.remove('selected');
			if(newCell) newCell.classList.add('selected');

			if(nextProps.selectedBooking !== null) this.clearSelection();
		}
	}

	shouldComponentUpdate(nextProps) {
		if(this.props.items.length < nextProps.items.length) return true;
		else return !deepEqual(nextProps.bookings, this.props.bookings);
	}

	getBookingCell(booking) {
		if(!booking) return null;
		else return this.getCell(booking.ItemId, moment(booking.start, 'YYYY-MM-DD'), 'right');
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
				cell.classList.add('booking');
				cell.classList.remove('selected');

				cell.innerHTML = booking.UserInfo.name;
			} else {
				continue;
			}

			const date = moment(booking.m_start);
			const end = moment(booking.m_end).subtract(1, 'days');

			while(date.isBefore(end)) {
				date.add(1, 'day');

				cell = this.getCell(booking.ItemId, date, 'left');
				if(cell) {
					cell.style.display = 'none';

					cell = this.getCell(booking.ItemId, date, 'right');
					cell.style.display = 'none';
				} else {
					break;
				}
			}

			date.add(1, 'day');

			cell = this.getCell(booking.ItemId, date, 'left');
			if(cell) {
				cell.style.display = 'none';
			}
		}
	}

	onMouseDown = (item, date, lr) => {
		const booking = this.props.bookings.find(booking => 
			booking.ItemId === item.id && moment(booking.start).isSame(date.date, 'day'))

		if(booking && lr === 'right') {
			this.clearSelection();
			
			if(this.props.selectedBooking && this.props.selectedBooking.id === booking.id) {
				this.props.selectBooking(null);
			} else {
				this.props.selectBooking(booking);
			}
		} else {
			this.selectStart = { item, date: date.date, type: lr };

			if(lr === 'right') {
				this.markSelection( { item, date: date.date },  { item, date: moment(date.date).add(1, 'days') });
			} else {
				this.markSelection( { item, date: moment(date.date).add(-1, 'days') },  { item, date: date.date });
			}
		}
	}

	onMouseUp = (item, date) => {
		this.selectStart = null;
	}

	onMouseMove = (e, item, date, lr) => {
		if(e.target === this.lastMouseMoveCell) return;
		this.lastMouseMoveCell = e.target;

		if(this.selectStart) {
			this.selectEnd = { item, date: date.date, type: lr };
			this.markSelection();
		}
	}

	clearSelection() {
		for(let cell of this.selectedCells) {
			cell.classList.remove('selected');
			cell.classList.remove('select-end');
		}

		this.selectedCells = [];
	}

	selectCell(cell) {
		this.selectedCells.push(cell);
		cell.classList.add('selected');
	}

	markSelection(start, end) {
		if(!start && !end) {
			start = this.selectStart;
			end = this.selectEnd;
		}

//		if(this.oldStart === start && this.oldEnd === end) return;

		if(start.item.id !== end.item.id) return;

/*
		if(this.oldStart && this.oldEnd) {
			if(this.oldStart.item.id === start.item.id &&
				this.oldEnd.item.id === end.item.id &&
				this.oldStart.date.isSame(start.date, 'day') &&
				this.oldEnd.date.isSame(end.date, 'day')) {

				return;
			}
		}*/

		this.clearSelection();
		if(this.props.selectedBooking) this.props.selectBooking(null);

		if(start.date.isSame(end.date, 'day')) {
			let startDate = start.date;
			let endDate = end.date;

			if(start.type === 'right') {
				endDate = moment(endDate).add(1, 'days');
			} else {
				startDate = moment(startDate).add(-1, 'days');
			}

			if(start.type === 'left' && end.type === 'right') {
				endDate = moment(endDate).add(1, 'days');
			} else if(start.type === 'right' && end.type === 'left') {
				startDate = moment(startDate).add(-1, 'days');
			}

			let cell = this.getCell(start.item.id, startDate, 'right');
			const cellEnd = this.getCell(end.item.id, endDate, 'right');

			while(cell !== cellEnd) {
				if(!cell) break;

				if(cell.classList.contains('booking')) {
					cell.previousSibling.classList.add('select-end');
					break;
				}

				this.selectCell(cell);

				cell = cell.nextSibling;
			}

			cellEnd.previousSibling.classList.add('select-end');

			/*
			let cellStart = this.getCell(start.item.id, startDate, 'right');
			let cellEnd = this.getCell(end.item.id, endDate, 'left');

			this.selectCell(cellStart);
			this.selectCell(cellEnd);

			cellEnd.classList.add('select-end');*/

			this.props.setSelectionInfo(start.item, startDate, endDate);
		}
		else if(end.date.isAfter(start.date)) {
			let startDate = start.date;
			let endDate = end.date;

			if(start.type === 'left') {
				startDate = moment(startDate).add(-1, 'days');
			}

			if(end.type === 'right') {
				endDate = moment(endDate).add(1, 'days');
			}

			let cell = this.getCell(start.item.id, startDate, 'right');
			const cellEnd = this.getCell(end.item.id, endDate, 'right');

			while(cell !== cellEnd) {
				if(!cell) break;

				if(cell.classList.contains('booking')) {
					cell.previousSibling.classList.add('select-end');
					break;
				}

				this.selectCell(cell);

				cell = cell.nextSibling;
			}

			cellEnd.previousSibling.classList.add('select-end');

			this.props.setSelectionInfo(start.item, startDate, endDate);
		} else {
			let startDate = start.date;
			let endDate = end.date;

			if(start.type === 'right') {
				startDate = moment(startDate).add(1, 'days');
			}

			if(end.type === 'left') {
				endDate = moment(endDate).add(-1, 'days');
			}

			let cell = this.getCell(start.item.id, startDate, 'left');
			const cellEnd = this.getCell(end.item.id, endDate, 'left');

			cell.classList.add('select-end');

			while(cell !== cellEnd) {
				if(!cell) break;

				if(cell.classList.contains('booking') || cell.classList.contains('item-name')) {
					break;
				}

				this.selectCell(cell);

				cell = cell.previousSibling;
			}

			this.props.setSelectionInfo(start.item, endDate, startDate);
		}

		//this.oldStart = start;
		//this.oldEnd = end;
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

		// force rerendering cells with this
		const key = new Date().getTime();

		return <table id='bookings'>
		<thead>
		<tr>
			{[<th key='empty' className='empty'></th>,
			WeekNumberColumns.map(week => [
				<th colSpan={ week.count * 2 } key={`${week}`}>
					{ week.number }
				</th>,
				]
			)
			]}
		</tr>
		<tr>
			{[<th key='empty' className='empty-date'></th>,
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
	 						<td
	 							key={`${key}-${date.text}-left`}
	 							className='day-left'
	 							ref={ref => this.cells[`${item.id}-${date.full}-left`] = ref}
	 							onMouseDown={e => this.onMouseDown(item, date, 'left')}
	 							onMouseUp={e => this.onMouseUp(item, date)}
	 							onMouseMove={e => this.onMouseMove(e, item, date, 'left')}
	 						></td>,
	 						<td
	 							key={`${key}-${date.text}-right`}
	 							className='day-right'
	 							ref={ref => this.cells[`${item.id}-${date.full}-right`] = ref}
	 							onMouseDown={e => this.onMouseDown(item, date, 'right')}
	 							onMouseUp={e => this.onMouseUp(item, date)}
	 							onMouseMove={e => this.onMouseMove(e, item, date, 'right')}
	 						></td>
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
		startDate: moment('20181011', 'YYYYMMDD'),
		selectedBooking: state.app.selectedBooking
	}
}, {
	selectBooking, setSelectionInfo, clearSelectionInfo
})(BookingTable);