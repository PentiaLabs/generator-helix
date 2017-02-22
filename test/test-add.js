/*global describe, it*/
'use strict';

var path = require('path');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');

describe('yo helix:add', function () {

	it('the generator can be required without throwing', () => {
		// not testing the actual run of generators yet
		require('../generators/add');
	});

	it('Can add on a emptyhelix solution', function checkFiles (done) {
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
				layer: 'Feature'
			}).then(() => {

				assert.file([
					'./src/Feature/AddedProjectFeatureName/code/Feature.AddedProjectFeatureName.csproj'
				]);

				done();
			});

	});

	it('Can add on a pentiahelix solution', function checkFiles (done) {
		helpers.run(path.join(__dirname, '../generators/add'))
			.inTmpDir(function () {
				var doneParent = this.async(); // `this` is the RunContext object.
				helpers.run(path.join(__dirname, '../generators/app'))
					.withPrompts({
						SolutionType: 'pentiahelix',
						SolutionName: 'PentiaHelixSolution',
						target: 'v4.6.1'
					}).then(() => {
						doneParent();
					});
			})
			.withPrompts({
				ProjectName: 'AddedProjectFeatureName',
				layer: 'Feature'
			}).then(() => {

				assert.file([
					'./src/Feature/AddedProjectFeatureName/code/Feature.AddedProjectFeatureName.csproj'
				]);

				done();
			});
	});
});
