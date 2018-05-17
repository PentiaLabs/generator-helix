const chalk = require('chalk');

function getTargets() {
return [{
	name: '.net 4.7',
	value: 'v4.7'
}, {
	name: '.net 4.6.2',
	value: 'v4.6.2'
}, {
	name: '.net 4.6.1',
	value: 'v4.6.1'
}, {
	name: '.net 4.6',
	value: 'v4.6'
}, {
	name: '.net 4.5.2',
	value: 'v4.5.2'
}];
}

function validateRequired(input, msg) {
	return !input ? msg : true;
}

function validateProjectName(input) {
	return validateRequired(input, chalk.red('You must provide a name for your project'));
}

module.exports = {
	getTargets: getTargets,
	validateProjectName: validateProjectName
};