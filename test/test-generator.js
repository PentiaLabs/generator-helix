/*global describe, beforeEach, before, it*/
'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');

describe('yo helix:app (pentiahelix)', function () {

	it('the generator can be required without throwing', () => {
		// not testing the actual run of generators yet
		require('../generators/app');
	});

	it('creates expected files', function checkFiles (done) {
		helpers.run(path.join(__dirname, '../generators/app'))
			.withPrompts({
				SolutionType: 'pentiahelix',
				SolutionName: 'UnitTest',
				target: 'v4.6.1'
			}).then(() => {
				assert.file([
					'package.json',
					'gulpfile.js',
					'UnitTest.sln'
				]);
				assert.fileContent([
					['gulpfile.js', /gulp/]
				]);
				done();
			});
	});
});
