import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import BookingTable from './components/BookingTable';
import Info from './components/Info';
import Nav from './components/Nav';
import Minimap from './components/Minimap';
import { SearchResults } from './components/Search';
import { setDate } from './reducers/appReducer';
import { loadBookings } from './reducers/bookingsReducer';
import { loadItems } from './reducers/itemsReducer';
import './App.css';

class App extends Component {
	componentDidMount() {
		this.props.init(moment('20181017', 'YYYYMMDD'));
	}

	render() {
		return <div>
			<Nav />
			<div className='container-fluid'>
				<div className='row'>
					{
						this.props.showSearchResults ?
							<div className='col-md-12'>
								<SearchResults />
							</div>
						: [
							<div className='col-md-3' key='left'>
								<Info />
							</div>,
							<div className='col-md-9 nopadding' key='right'>
								<Minimap key='minimap' />
								<BookingTable key='booking-table' />
							</div>
						]
					}
				</div>
			</div>
		</div>;
	}
}

export default connect((state) => {
	return {
		showSearchResults: state.app.searchResults.length > 0
	}
}, {
	loadBookings, loadItems, setDate,
}, (stateProps, dispatchProps, ownProps) => {
	return Object.assign({
		init: (date) => {
			dispatchProps.setDate(date);
			dispatchProps.loadItems();
			dispatchProps.loadBookings();
		}
	}, ownProps, stateProps);
})(App);
