var gulp = require('gulp');
var runSequence = require('run-sequence');
var publish = require('@pentia/publish-projects');
var packagemanager = require('@pentia/sitecore-package-manager');
var configTransform = require('@pentia/configuration-transformer');
var watchprojects = require('@pentia/watch-publish-projects');

gulp.task('Setup-Development-Environment', function (callback) {
	runSequence(
		'install-packages',
		'publish-all-layers',
		'apply-xml-transform',
		callback);
});

gulp.task('setup', function (callback) {
	runSequence('Setup-Development-Environment',
		callback);
});