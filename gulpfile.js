// Dependencies
var path             = require('path');
var gulp             = require('gulp');
var eslint           = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha            = require('gulp-mocha');
var istanbul         = require('gulp-istanbul');
var nsp              = require('gulp-nsp');
var plumber          = require('gulp-plumber');
var babel            = require('gulp-babel');
var isparta          = require('isparta');

// Initialize the babel transpiler
require('babel-core/register');

// Configuration
var config = {
  // Main package.json file
  package: 'package.json',
  // Glob patterns for source files
  globs: {
    scripts: 'lib/**/*.js',
    tests: 'test/**/*.js'
  },
  dirs: {
    dist: 'dist'
  },
  // Test runner
  mocha: {
    reporter: 'spec'
  },
  // Code coverage
  istanbul: {
    includeUntested: true,
    instrumenter: isparta.Instrumenter
  },
  // ESLint options
  eslint: {

  },
  // Coveralls path
  coverageFile: 'coverage/lcov.info'
};

// Lint
gulp.task('static', function () {
  return gulp.src(config.globs.scripts)
    .pipe(excludeGitignore())
    .pipe(eslint(config.eslint))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Node security project
gulp.task('nsp', function (cb) {
  nsp(config.package, cb);
});

// Prepare instanbul instrumenter
gulp.task('pre-test', function () {
  return gulp.src(config.globs.scripts)
    .pipe(istanbul(config.istanbul))
    .pipe(istanbul.hookRequire());
});

// Run Mocha tests
gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src(config.globs.tests)
    .pipe(plumber())
    .pipe(mocha(config.mocha))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .pipe(notify(""))
    .on('end', function () {
      cb(mochaErr);
    });
});

// Babel transpiler
gulp.task('babel', function () {
  return gulp.src(config.globs.scripts)
    .pipe(babel())
    .pipe(gulp.dest(config.dirs.dist));
});

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['static', 'test']);
