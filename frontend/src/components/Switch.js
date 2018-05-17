import React, {Component} from 'react';

export default class Switch extends Component {
	render() {
		return <div>
			{
				React.Children.map(this.props.children, (child, index) => {
					if(child.props.case === this.props.value) {
						const props = {};

						for(let k in this.props) {
							switch(k) {
								case 'children':
								case 'value':
									break;
								default:
									props[k] = this.props[k];
							}
						}

						return React.cloneElement(child, {...props});
					} else {
						return null;
					}
				})
			}
		</div>
	}
}