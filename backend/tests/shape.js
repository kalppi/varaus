
class Shape {
	constructor(type, options) {
		this.type = type;
		this.fields = [];
		this.omitFields = [];
		this.options = options || {};
	}

	field(name, shape) {
		this.fields.push({
			shape,
			name
		});

		return this;
	}

	omit(name) {
		this.omitFields.push(name);

		return this;
	}

	matchesRequest() {
		return (res) => {
			return this.matches(res.body, {});
		}
	}

	matches(object, options) {
		options = options || {};

		switch(this.type.type) {
			case 'arrayOf':
				if(!Array.isArray(object)) {
					throw new Error(`Expected array.`);
				}

				for(let item of object) {
					const err = this.type.shape.matches(item, {omit: this.omitFields});

					if(err) throw err;
				}
				break;
			case 'object':
				const handled = [];

				for(let field of this.fields) {
					if(options.omit && options.omit.includes(field.name)) continue;

					const value = object[field.name];

					if(value === undefined) {
						throw new Error(`Missing field: ${field.name}`);
					}

					if(field.shape !== undefined) {
						const err = field.shape(field, value);

						if(err) throw err;
					}

					handled.push(field.name)
				}

				if(this.options.errorUnknowns) {
					const keys = Object.keys(object);

					for(let key of keys) {
						if(!handled.includes(key)) {
							throw new Error(`Unknown key '${key}'`);
						}
					}
				}

				break;
		}
	}
}

export default {
	object: (options) => {
		return new Shape({type: 'object'}, options);
	},

	arrayOf: (shape, options) => {
		return new Shape({type: 'arrayOf', shape}, options);
	},

	integer: (options) => {
		return (field, s) => {
			s = String(s);

			if(/^\-?[0-9]+$/.test(s)) {
				const int = parseInt(s, 10);

				if(options.min !== undefined) {
					if(s < options.min) {
						return new Error(`Field '${field.name}' (${s}) is smaller than expected minimum ${options.min}.`);
					}
				}

				if(options.max !== undefined) {
					if(s > options.max) {
						return new Error(`Field '${field.name}' (${s}) is bigger than expected maximum ${options.max}.`);
					}
				}
			} else {
				return new Error(`Field '${field.name}' has wrong shape. Expected integer.`);
			}
		}
	},

	regex: (regex) => {
		return (field, s) => {
			if(!regex.test(s)) {
				return new Error(`Field '${field.name}' (${s}) not passing regex ${regex}.`);
			}
		}
	},

	array: () => {
		return (field, s) => {
			if(!Array.isArray(s)) {
				return new Error(`Field '${field.name}' is not an array.`);
			}
		}
	},

	toBeShaped: () => {
		return {
			toBeShaped: (received, shape) => {
				try {
					shape.matches(received);
				} catch (e) {
					return { pass: false, message: () => e.message };
				}

				return { pass: true };
			}
		};
	} 

}