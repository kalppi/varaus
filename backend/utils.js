
const log = (...args) => {
	if(process.env.NODE_ENV !== 'test') {
		console.log.apply(console, args);
	}
};

const numeric = (s) => {
	return /^[0-9]+$/.test(String(s));
};

export { log, numeric };