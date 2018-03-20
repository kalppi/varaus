import React, { Component } from 'react';
import { connect } from 'react-redux';
import { search } from '../reducers/appReducer';
import './Search.css';

class Search extends Component {
	onChange(e) {
		clearTimeout(this.timer);

		this.timer = setTimeout(() => {
			this.doSearch();
		}, 300);
	}

	doSearch() {
		const search = this.input.value;

		this.props.search(search);
	}

	render() {
		return <input ref={ref => this.input = ref} className="form-control m-sm-0" type="search" placeholder="Search" aria-label="Search" onChange={this.onChange.bind(this)} />;
	}
}

class SearchResults extends Component {
	componentDidMount() {
		
	}

	render() {
		return <div id='Search'>
		{this.props.searchResults.map(result => 
			<div key={result.bookingId}>{result.bookingId} {result.search}</div>
		)}
		</div>;
	}
}

const ConnectedSearch = connect(null, {
	search
})(Search);

const ConnectedSearchResults = connect((state) => {
	return {
		searchResults: state.app.searchResults
	}
})(SearchResults);

export { ConnectedSearch as Search, ConnectedSearchResults as SearchResults };