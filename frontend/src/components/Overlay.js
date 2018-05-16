import React, { Component } from 'react';
import './Overlay.css';

export default class Overlay extends Component {
	isVisible() {
		let visible = false;

		if(this.props.options && this.props.options.visible !== undefined) {
			visible = this.props.options.visible;
		}

		return visible;
	}

	render() {
		const visible = this.isVisible();

		if(!visible) {
			return null;
		}

		return <div id="overlay">
			<div className='container'>
				<div className='row'>
					<div className='col-md-12'>
						{
							React.Children.map(this.props.children, (child, index) => {
								return React.cloneElement(child, {
									resolve: this.props.options.resolve
								});
							})
						}
					</div>
				</div>
			</div>
		</div>
	}
}