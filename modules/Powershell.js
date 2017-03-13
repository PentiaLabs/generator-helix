/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
'use strict';

class Powershell {
	constructor() {
	}

	runAsync(pathToScriptFile, parameters) {
		console.log('Powershell - running: ' + pathToScriptFile + ' ' + parameters);
		var spawn = require('child_process').spawn;
		var child = spawn('powershell.exe', [pathToScriptFile.replace(/ /g,'` '), parameters]);

		child.stdout.setEncoding('utf8');
		child.stderr.setEncoding('utf8');

		child.stdout.on('data', function (data) {
			console.log(data);
		});

		child.stderr.on('data', function (data) {
			console.error('Error: ' + data);
		});

		child.on('exit', function () {
			console.log('Powershell - done running ' + pathToScriptFile + parameters);
		});

		child.stdin.end();
	}
}

exports = module.exports = new Powershell();
