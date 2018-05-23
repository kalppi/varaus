const BG_RED = '\x1b[41m';
const BG_GREEN = '\x1b[42m';
const FG_BLUE = '\x1b[34m';
const FG_YELLOW = '\x1b[33m';
const FG_BLACK = '\x1b[30m';

const RESET = '\x1b[0m';

const log = (log, body) => {
	console.log(`${BG_RED}${log}${RESET} ${FG_YELLOW}→ ${FG_BLACK}${BG_GREEN}${body}${RESET}`);
};

const timeoutMs = 2000;

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

		const timeout = setTimeout(() => {
			log(res.log, `NO RESPONSE AFTER ${timeoutMs}ms`);
		}, timeoutMs);

		res.timeout = timeout;

		const oSend = res.send.bind(res);
		const oEnd = res.end.bind(res);

		const send = (body) => {
			clearTimeout(res.timeout);

			let logBody = body;

			if(options && options[res.path]) {
				logBody = JSON.stringify(options[res.path](JSON.parse(logBody)));
			}

			log(res.log, logBody);

			res.isLogged = true;

			oSend(body);
		};

		const end = (body) => {
			clearTimeout(res.timeout);

			if(!res.isLogged) {
				log(res.log, res.statusCode);
			}

			oEnd(body);
		};

		res.send = send.bind(res);
		res.end = end.bind(res);

		next();
	};
};

