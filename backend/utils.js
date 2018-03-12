
const log = () => {
	if(process.env.NODE_ENV !== 'test') {
		console.log.apply(console, arguments);
	}
}

export { log };