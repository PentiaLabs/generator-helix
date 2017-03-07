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
					'./src/Feature/AddedProjectFeatureName/code/Feature.AddedProjectFeatureName.csproj',
					'./src/Feature/AddedProjectFeatureName/code/App_Config/Include/Feature.AddedProjectFeatureName/serialization.config'
				]);

				assert.fileContent([
					['./src/Feature/AddedProjectFeatureName/code/App_Config/Include/Feature.AddedProjectFeatureName/serialization.config', /physicalRootPath="\$\(featureFolder\)\\AddedProjectFeatureName\\\$\(configurationFolder\)"/]
				]);

				done();
			});
	});

	it('Can add on a emptyhelix solution with vendorprefix', function checkFiles (done) {
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
				layer: 'Feature'
			}).then(() => {

				assert.file([
					'./src/Feature/AddedProjectFeatureName/code/Acme.Feature.AddedProjectFeatureName.csproj'
				]);

				done();
			});

	});

	it('Can add on a emptyhelix solution with empty vendorprefix', function checkFiles (done) {
		// This test might seem unnecessary. But when you run the code normally an empty value from the prompt is an empty string,
		// but in a test context it's 'undefined'
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
				VendorPrefix: '',
				layer: 'Feature'
			}).then(() => {

				assert.file([
					'./src/Feature/AddedProjectFeatureName/code/Feature.AddedProjectFeatureName.csproj'
				]);

				done();
			});
	});
});
