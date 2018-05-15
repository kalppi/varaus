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
		this.selectStart = null;
		this.selectEnd = null;
		this.selectedCells = [];
		this.lastMouseMoveCell = null;
	}

	componentDidMount() {
		this.draw();
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.selectedBooking !== nextProps.selectedBooking) {
			const oldCell = this.getBookingCell(this.props.selectedBooking);
			const newCell = this.getBookingCell(nextProps.selectedBooking);

			if(oldCell) oldCell.classList.remove('selected');
			if(newCell) newCell.classList.add('selected');

			if(nextProps.selectedBooking !== null) this.clearSelection();
		}

		if(nextProps.selection && this.props.selection !== nextProps.selection) {
			this.markSelection(nextProps.selection.item, nextProps.selection.start, nextProps.selection.end);
		}
	}

	componentDidUpdate() {
		this.draw();
	}

	markSelection(item, start, end) {
		if(start.isAfter(end)) {
			[start, end] = [end, start];
		}

		let cell = this.getCell(item.id, start, 'right');
		const cellEnd = this.getCell(item.id, end, 'right');

		if(cell === null && start.isBefore(this.props.startDate)) {
			cell = this.getCell(item.id, moment(this.props.startDate).add(-1, 'days'), 'right');
		}

		while(cell !== cellEnd) {
			if(!cell) break;

			if(!cell.classList.contains('cell')) {
				cell.previousSibling.classList.add('select-end');
				break;
			}

			this.selectCell(cell);

			cell = cell.nextSibling;
		}

		if(cellEnd) cellEnd.previousSibling.classList.add('select-end');
	}

	shouldComponentUpdate(nextProps) {
		if(!this.props.startDate || !this.props.endDate) return false;

		if(!this.props.startDate.isSame(nextProps.startDate, 'day') || !this.props.endDate.isSame(nextProps.endDate, 'day')) return true;
		else if(this.props.items.length < nextProps.items.length) return true;
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

	draw() {
		for(let booking of this.props.bookings) {
			const bookingStart = moment(booking.start);
			const bookingEnd = moment(booking.end);

			let cell = this.getCell(booking.ItemId, bookingStart, 'right');
			const cellEnd = this.getCell(booking.ItemId, bookingEnd, 'right');

			if(!cell) {
				if(bookingStart.isBefore(this.props.startDate) && bookingEnd.isSameOrAfter(this.props.startDate)) {
					cell = this.getCell(booking.ItemId, this.props.startDate, 'left');
					if(!cell) continue;

					cell = cell.previousSibling;
				} else {
					continue;
				}
			}

			const firstCell = cell;
			let colSpan = 1;

			cell.classList.add('booking');
			cell.classList.remove('selected');
			cell.children[0].innerHTML = booking.UserInfo.name;

			if(this.props.selectedBooking) {
				if(this.props.selectedBooking.id === booking.id) {
					cell.classList.add('selected');
				}
			}

			cell = cell.nextSibling;

			while(cell !== cellEnd) {
				if(!cell) break;
				
				if(!cell.classList.contains('cell')) {
					break;
				}
				
				cell.style.display = 'none';

				cell = cell.nextSibling;
				colSpan++;
			}

			firstCell.colSpan = colSpan;
		}

		if(this.props.selection && this.props.selection) {
			const { item, start, end } = this.props.selection;
			this.markSelection(item, start, end);
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
				this.setSelection( { item, date: date.date },  { item, date: moment(date.date).add(1, 'days') });
			} else {
				this.setSelection( { item, date: moment(date.date).add(-1, 'days') },  { item, date: date.date });
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
			this.setSelection(this.selectStart, this.selectEnd);
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

	setSelection(start, end) {
		if(start.item.id !== end.item.id) return;

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

			this.props.setSelectionInfo(start.item, endDate, startDate);
		}
	}

	render() {
		if(!this.props.startDate || !this.props.endDate) return null;

		for(let booking of this.props.bookings) {
			booking.m_start = moment(booking.start, 'YYYY-MM-DD');
			booking.m_end = moment(booking.end, 'YYYY-MM-DD');
			booking.length = booking.m_end.diff(booking.m_start, 'days');
		}

		const weekNumbers = [];
		const dates = [];
		const date = moment(this.props.startDate);

		const diff = this.props.endDate.diff(this.props.startDate, 'days');

		for(let i = 0; i < diff; i++) {
			dates.push({
				text: date.format('DD.MM.'),
				full: date.format('YYYY-MM-DD'),
				date: moment(date)
			});
			weekNumbers.push(date.isoWeek());
			date.add(1, 'day');
		}

		weekNumbers.unshift(moment(this.props.startDate).add(-1, 'days').isoWeek());
		weekNumbers.push(date.isoWeek());

		const weekNumberColumns = weekNumbers.reduce((acc, value) => {
			if(acc.length === 0) {
				return [{
					number: value,
					count: 1,
					width: 2
				}];
			}

			const last = acc[acc.length - 1];

			if(last.number === value) {
				last.count++;
				last.width = last.count * 2;
			} else {
				acc.push({
					number: value,
					count: 1,
					width: 2
				});
			}

			return acc;
		}, []);

		weekNumberColumns[0].width -= 1;
		weekNumberColumns[weekNumberColumns.length - 1].width -= 1;

		// force rerendering cells with this
		const key = new Date().getTime();

		const dl = moment(dates[0].date).add(-1, 'days');

		const dateLeft = {
			text: dl.format('DD.MM.'),
			full: dl.format('YYYY-MM-DD'),
			date: dl
		};

		const dateLeftWeekend = dateLeft.date.isoWeekday() >= 6 ? 'weekend' : '';
		const dateRightWeekend = moment(dates[dates.length - 1].date).add(1, 'days').isoWeekday() >= 6 ? 'weekend' : '';

		const items = [...this.props.items];

		// extra row just to keep the table width same with any number of booking cells.
		items.push({
			id: Number.MAX_SAFE_INTEGER, 
			name: '',
		});

		return <table id='bookings'>
		<thead>
		<tr>
			{[<th key='empty' className='empty'></th>,
			weekNumberColumns.map((week, index) => [
				<th colSpan={  week.width } key={`${week}`}>
					{ week.number }
				</th>,
				]
			)
			]}
		</tr>
		<tr>
			{[<th key='empty' className='empty-date'></th>,
				<th key='right-half' className={`left-half ${dateLeftWeekend}`}></th>,
				dates.map(date => {
					const weekend = date.date.isoWeekday() >= 6 ? 'weekend' : '';

					return <th colSpan='2' key={`date-${date.date}-left`}  className={weekend}>
						{ date.text }
					</th>;
				}),
				<th key='left-half' className={`left-half ${dateRightWeekend}`}></th>
			]}
		</tr>
		</thead>
		<tbody>
		 { items.map(item => {
	 		return <tr key={item.id + key}>
	 			{[
	 				<td key={item.id} className='item-name'>
	 					{item.name}
	 				</td>,
	 				<td
	 					key='right-half'
	 					className={`day-right cell ${dateLeftWeekend}`}
	 					ref={ref => this.cells[`${item.id}-${dateLeft.full}-right`] = ref}
	 					onMouseDown={e => this.onMouseDown(item, dateLeft, 'right')}
	 				><div></div></td>,
	 				dates.map(date => {
	 					const weekend = date.date.isoWeekday() >= 6 ? 'weekend' : '';

	 					return [
	 						<td
	 							key={`${key}-${date.text}-left`}
	 							className={`day-left cell ${weekend}`}
	 							ref={ref => this.cells[`${item.id}-${date.full}-left`] = ref}
	 							onMouseDown={e => this.onMouseDown(item, date, 'left')}
	 							onMouseUp={e => this.onMouseUp(item, date)}
	 							onMouseMove={e => this.onMouseMove(e, item, date, 'left')}
	 						></td>,
	 						<td
	 							key={`${key}-${date.text}-right`}
	 							className={`day-right cell ${weekend}`}
	 							ref={ref => this.cells[`${item.id}-${date.full}-right`] = ref}
	 							onMouseDown={e => this.onMouseDown(item, date, 'right')}
	 							onMouseUp={e => this.onMouseUp(item, date)}
	 							onMouseMove={e => this.onMouseMove(e, item, date, 'right')}
	 						><div></div></td>
	 						]
	 				}),
	 				<td key='left-half' className={`day-left cell ${dateRightWeekend}`}><div></div></td>
	 			]}
	 		</tr>
	 	}
		 )}
		</tbody>
		</table>;
	}
}


export default connect((state) => {
	return {
		bookings: state.bookings,
		items: state.items,
		startDate: state.app.startDate,
		endDate: state.app.endDate,
		selectedBooking: state.app.selectedBooking,
		selection: state.app.selection
	}
}, {
	selectBooking, setSelectionInfo, clearSelectionInfo
})(BookingTable);