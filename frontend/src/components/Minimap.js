import React, {Component} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { setDate } from '../reducers/appReducer';
import { loadBookings } from '../reducers/bookingsReducer';
import './Minimap.css';

class Minimap extends Component {
	componentDidMount() {
		document.addEventListener('mouseup', this.onMouseUp.bind(this));
		document.addEventListener('mousemove', this.onMouseMove.bind(this));

		this.draw(this.props);
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.onMouseUp.bind(this));
		document.removeEventListener('mousemove', this.onMouseMove.bind(this));
	}

	componentWillReceiveProps(nextProps) {
		this.draw(nextProps);
	}

	draw(props) {
		if(!props.tableStartDate || !props.tableEndDate || !props.viewBounds) return;
		this.diff = props.viewBounds.end.diff(props.viewBounds.start, 'days');

		const scale = 5;

		const days = props.viewBounds.end.diff(props.viewBounds.start, 'days') + 2;
		const items = props.items.length;

		this.days = days;

		this.canvas.width = days * scale + days;
		this.canvas.height = items * scale + 4 + (items - 1);

		const ctx = this.canvas.getContext('2d');
		ctx.fillStyle = '#eee';
		ctx.fillRect(0, 0, days * scale + days, items * scale + 4 + (items - 1));

		ctx.fillStyle = 'green';
		
		const rects = props.bookings.reduce((acc, value) => {
			let date = moment(value.start, 'YYYY-MM-DD');
			const endDate = moment(value.end, 'YYYY-MM-DD');
			const itemIndex = props.items.findIndex(item => item.id === value.ItemId);

			while(date.isBefore(endDate)) {
				const dayIndex = date.diff(props.viewBounds.start, 'days') + 1;

				date.add(1, 'days');

				if(acc.length > 0) {
					const last = acc[acc.length - 1];

					if(last.id === value.id) {
						last.w++;

						continue;
					}
				}

				acc.push({
					x: dayIndex,
					y: itemIndex,
					w: 1,
					id: value.id
				});
			}		

			return acc;
		}, []);

		for(let rect of rects) {
			ctx.fillRect(rect.x * scale + rect.x, rect.y * scale + 2 + rect.y, rect.w * scale, scale);			
		}

		const startX = props.tableStartDate.diff(props.viewBounds.start, 'days');
		const tableDayDiff = props.tableEndDate.diff(props.tableStartDate, 'days') + 2;

		ctx.strokeStyle = 'red';
		ctx.lineWidth = 1;
		ctx.rect(startX * scale + startX - 1, 0, tableDayDiff * scale + 4 - 1, items * scale + 4 + (items - 1));
		ctx.stroke();
	}

	onMouseDown(e) {
		const rect = this.canvas.getBoundingClientRect();		
		const x = e.clientX - rect.left;
		const p = x / rect.width;
		const date = moment(this.props.viewBounds.start).add(parseInt(this.diff * p, 10), 'days');

		if(date.isBefore(this.props.tableStartDate) || date.isAfter(this.props.tableEndDate)) {
			this.props.setDate(date);
			this.mouseStartDate = moment(date);
		} else {
			this.mouseStartDate = moment(this.props.date);
		}

		this.mouseDownX = e.clientX - rect.left;
	}

	onMouseUp(e) {
		this.mouseDownX = null;

		//console.log(this.props.date.format('D.M.'));

		this.props.loadBookings();
	}

	onMouseMove(e) {
		if(!this.mouseDownX) return;

		const rect = this.canvas.getBoundingClientRect();

		if(e.clientX < rect.left || e.clientX > rect.right) {
			return;
		}

		const x = (e.clientX - rect.left - this.mouseDownX);
		const p = x / (rect.width / this.diff);
		const date = moment(this.mouseStartDate).add(parseInt(p, 10), 'days');

		this.props.setDate(date);
	}

	render() {
		return <div id='minimap'>
			<table>
			<tbody>
			<tr>
				<td className='left'>{this.props.viewBounds ? this.props.viewBounds.start.format('D.M. YYYY') : null}</td>
				<td className='center'>{this.props.date ? this.props.date.format('D.M. YYYY') : null}</td>
				<td className='right'>{this.props.viewBounds ? this.props.viewBounds.end.format('D.M. YYYY') : null}</td>
			</tr>
			</tbody>
			</table>

			<canvas
				ref={ref => this.canvas = ref}
				onMouseDown={this.onMouseDown.bind(this)}
			/>
		</div>
	}
}

export default connect((state) => {
	return {
		bookings: state.bookings,
		items: state.items,
		date: state.app.date,
		viewBounds: state.app.minimapViewBounds,
		tableStartDate: state.app.startDate,
		tableEndDate: state.app.endDate
	}
}, {
	setDate, loadBookings
})(Minimap);