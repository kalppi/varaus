const BG_RED = '\x1b[41m';
const BG_GREEN = '\x1b[42m';
const FG_BLUE = '\x1b[34m';
const FG_YELLOW = '\x1b[33m';

const RESET = '\x1b[0m';


export const logger = (options) => {
	return async (req, res, next) => {
		let body = '';

		if(req.method === 'GET') {
			body = JSON.stringify(req.query);
		} else {
			body = JSON.stringify(req.body);
		}

		if(body === '{}' || body === '[]') body = '';
		else body = ' ' + body;

		res.log = `${req.method} ${req.path}${body}`;
		res.path = req.path;

		const oSend = res.send.bind(res);
		const send = (body) => {
			let log = body;

			if(options && options[res.path]) {
				log = JSON.stringify(options[res.path](JSON.parse(log)));
			}

			console.log(`${BG_RED}${res.log}${RESET} ${FG_YELLOW}→ ${BG_GREEN}${log}${RESET}`);

			oSend(body);
		};

		res.send = send.bind(res);

		next();
	};
};

