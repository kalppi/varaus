import React, { Component } from 'react';
import { connect } from 'react-redux';
import { search, clearSearch } from '../reducers/appReducer';
import { formatDate as fd } from '../utils';

import './css/Search.css';

class Search extends Component {
	onChange(e) {
		clearTimeout(this.timer);

		/*this.timer = setTimeout(() => {
			this.doSearch();
		}, 300);*/

		this.doSearch();
	}

	doSearch() {
		const search = this.input.value.trim();

		if(search.length === 0) {
			this.props.clearSearch();
		} else {
			this.props.search(search);
		}
	}

	render() {
		return <div>
			<input
				ref={ref => this.input = ref}
				className="form-control m-sm-0"
				type="search"
				placeholder="Search"
				aria-label="Search"
				onChange={this.onChange.bind(this)}
			/>
			</div>
	}
}

class SearchResults extends Component {
	render() {
		return <table className='table table-sm' id='Search'>
			<thead className='thead-dark'>
				<tr>
					<th className='search-id'>#</th>
					<th className='search-start'>start</th>
					<th className='search-end'>end</th>
					<th className='search-name'>name</th>
					<th className='search-email'>email</th>
					<th className='search-item'>room</th>
				</tr>
			</thead>
			<tbody>
		{this.props.searchResults.map(result => 
			<tr key={result.id}>
				<td className='search-id'>{result.id}</td>
				<td className='search-start'>{fd(result.start)}</td>
				<td className='search-end'>{fd(result.end)}</td>
				<td className='search-name'>{result.Customer.name}</td>
				<td className='search-email'>{result.Customer.email}</td>
				<td className='search-item'>{result.Item.name}</td>
			</tr>
		)}
		</tbody>
		</table>;
	}
}

const ConnectedSearch = connect(null, {
	search, clearSearch
})(Search);

const ConnectedSearchResults = connect((state) => {
	return {
		searchResults: state.app.searchResults
	}
})(SearchResults);

export { ConnectedSearch as Search, ConnectedSearchResults as SearchResults };