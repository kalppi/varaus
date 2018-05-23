import { check } from 'validator';

const isId = s => {
	check(s).min(1).isInt();
};

const isDate = s => {
	check(s).regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
};

export default { isId, isDate };