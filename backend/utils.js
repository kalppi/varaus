
const log = (...args) => {
	if(process.env.NODE_ENV !== 'test') {
		console.log.apply(console, args);
	}
};

export { log };