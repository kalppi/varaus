import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideOverlay } from '../reducers/overlayReducer';

import './css/Overlay.css';

class Overlay extends Component {
	componentDidMount(){
		document.addEventListener('keydown', this.onKeyDown.bind(this), false);
	}

	componentWillUnmount(){
		document.removeEventListener('keydown', this.onKeyDown.bind(this), false);
	}

	onKeyDown(e) {
		if(e.keyCode === 27 && this.props.options.reject) {
			this.props.options.reject();
			this.props.hideOverlay();
		}
	}

	isVisible() {
		let visible = false;

		if(this.props.options && this.props.options.visible !== undefined) {
			visible = this.props.options.visible;
		}

		return visible;
	}

	onClick(e) {
		if(e.target.id === 'overlay') {
			this.props.options.reject();
			this.props.hideOverlay();
		}
	}

	render() {
		const visible = this.isVisible();

		if(!visible) {
			return null;
		}

		return <div id="overlay" onClick={this.onClick.bind(this)}>
			<div className='container'>
				<div className='row'>
					<div className='col-md-12'>
						{
							React.Children.map(this.props.children, (child, index) => {
								return React.cloneElement(child, {
									resolve: (v) => {
										this.props.options.resolve(v);
										this.props.hideOverlay()
									},
									cancel: () => {
										this.props.options.reject();
										this.props.hideOverlay();
									}
								});
							})
						}
					</div>
				</div>
			</div>
		</div>
	}
}

export default connect(null, { hideOverlay })(Overlay);