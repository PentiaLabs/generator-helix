/*global describe, it*/
'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');

describe('yo helix:add modulegroup', function () {

	it('Can add on a emptyhelix solution with modulegroup', function checkFiles (done) {
		helpers.run(path.join(__dirname, '../generators/add'))
			.inTmpDir(function () {
				var doneParent = this.async(); // `this` is the RunContext object.
				helpers.run(path.join(__dirname, '../generators/app'))
					.withPrompts({
						SolutionType: 'emptyhelix',
						SolutionName: 'UnitTest',
						target: 'v4.6.1'
					}).then(() => {
						doneParent();
					});
			})
			.withPrompts({
				ProjectName: 'AddedProjectFeatureName',
				VendorPrefix: 'Acme',
				layer: 'Feature',
				modulegroup: 'Login'
			}).then(() => {

				assert.file([
					'./src/Feature/Login/AddedProjectFeatureName/code/Acme.Feature.AddedProjectFeatureName.csproj'
				]);

				done();
			});

	});

	it('Can add on a pentia solution with empty modulegroup', function checkFiles (done) {
		// This test might seem unnecessary. But when you run the code normally an empty value from the prompt is an empty string,
		// but in a test context it's 'undefined'
		helpers.run(path.join(__dirname, '../generators/add'))
			.inTmpDir(function () {
				var doneParent = this.async(); // `this` is the RunContext object.
				helpers.run(path.join(__dirname, '../generators/app'))
					.withPrompts({
						SolutionType: 'pentiahelix',
						SolutionName: 'UnitTest',
						target: 'v4.6.1'
					}).then(() => {
						doneParent();
					});
			})
			.withPrompts({
				ProjectName: 'AddedProjectFeatureName',
				VendorPrefix: '',
				layer: 'Feature',
				modulegroup: 'Login'
			}).then(() => {

				assert.file([
					'./src/Feature/Login/AddedProjectFeatureName/code/Feature.AddedProjectFeatureName.csproj'
				]);

				done();
			});

	});
});
