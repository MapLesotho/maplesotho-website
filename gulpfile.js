'use strict';
var fs = require('fs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');
var watchify = require('watchify');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var cp = require('child_process');

// /////////////////////////////////////////////////////////////////////////////
// --------------------------- Variables -------------------------------------//
// ---------------------------------------------------------------------------//

// The package.json
var pkg;

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Helper functions --------------------------------//
// ---------------------------------------------------------------------------//

function readPackage () {
  pkg = JSON.parse(fs.readFileSync('package.json'));
}
readPackage();

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//-------------------------- Helper tasks ------------------------------------//
//----------------------------------------------------------------------------//
gulp.task('clean', function () {
  return del(['.tmp', 'dist'])
    .then(function () {
      $.cache.clearAll();
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//-------------------------- Copy tasks --------------------------------------//
//----------------------------------------------------------------------------//

// Copy from the .tmp to _site directory.
// To reduce build times the assets are compiles at the same time as jekyll
// renders the site. Once the rendering has finished the assets are copied.
gulp.task('copy:assets', function(done) {
  return gulp.src('.tmp/assets/**')
    .pipe(gulp.dest('_site/assets'));
});


// //////////////////////////////////////////////////////////////////////////////
// --------------------------- Styles tasks -----------------------------------//
// ----------------------------------------------------------------------------//

gulp.task('styles', function () {
  return gulp.src('app/assets/styles/main.scss')
    .pipe($.plumber(function (e) {
      notifier.notify({
        title: 'Oops! Sass errored:',
        message: e.message
      });
      console.log('Sass error:', e.toString());
      // Allows the watch to continue.
      this.emit('end');
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: require('node-bourbon').with('node_modules/jeet/scss', 'assets/styles')
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/styles'))
    // .pipe(reload({stream: true}));
});

// //////////////////////////////////////////////////////////////////////////////
// --------------------------- Jekyll tasks -----------------------------------//
// ----------------------------------------------------------------------------//
var environment = 'development';
gulp.task('prod', function(done) {
  environment = 'production';
  runSequence('clean', 'build', done);
});

// Build the jekyll website.
gulp.task('jekyll', function (done) {
  var args = ['exec', 'jekyll', 'build'];

  switch (environment) {
    case 'development':
      args.push('--config=_config-dev.yml');
      // args.push('--config=_config.yml,_config-dev.yml');
    break;
    case 'stage':
      args.push('--config=_config.yml');
      // args.push('--config=_config.yml,_config-stage.yml');
    break;
    case 'production':
      args.push('--config=_config.yml');
    break;
  }

  return cp.spawn('bundle', args, {stdio: 'inherit'})
    .on('close', done);
});

// Build the jekyll website.
// Reload all the browsers.
gulp.task('jekyll:rebuild', ['jekyll'], function () {
  browserSync.reload();
});

// Main build task
// Builds the site. Destination --> _site
gulp.task('build', function(done) {
  runSequence(['jekyll', 'styles'], ['copy:assets'], done);
});


gulp.task('serve', ['build'], function () {
  browserSync({
    port: 3000,
    server: {
      baseDir: ['.tmp', '_site']
    }
  });

  gulp.watch('app/assets/styles/**/*.scss', function() {
    runSequence('styles', ['copy:assets']);
  });

  gulp.watch(['app/**/*.html', 'app/**/*.md', 'app/**/*.json', 'app/**/*.geojson', '_config*'], function() {
    runSequence('jekyll', browserReload);
  });
});

var shouldReload = true;
function browserReload() {
  if (shouldReload) {
    browserSync.reload();
  }
}
