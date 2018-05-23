
const checkEnvs = () => {
	const m = v => v === undefined;
	const missing = [];

	switch(process.env.NODE_ENV) {
		case 'test':
			if(m(process.env.TEST_PORT)) missing.push('TEST_PORT');
			if(m(process.env.TEST_DB)) missing.push('TEST_DB');

			break;
		case 'dev':
			if(m(process.env.DEV_PORT)) missing.push('DEV_PORT');
			if(m(process.env.DEV_DB)) missing.push('DEV_DB');
			
			break;
		case 'production':
			if(m(process.env.PORT)) missing.push('PORT');
			if(m(process.env.DB)) missing.push('DB');
			
			break;
	}

	if(m(process.env.SECRET)) missing.push('SECRET');

	return missing;
};

const missing = checkEnvs();

if(missing.length > 0) {
	console.log('The following environment variables are missing: ' + missing.join(', '));
	process.exit(1);
}