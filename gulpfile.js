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
var exit = require('gulp-exit');
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var cp = require('child_process');
var YAML = require('yamljs');

var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var reload = browserSync.reload;

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

var prodBuild = false;
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
    .pipe(reload({stream: true}));
});

// /////////////////////////////////////////////////////////////////////////////
// ------------------------ Collecticon tasks --------------------------------//
// -------------------- (Font generation related) ----------------------------//
// ---------------------------------------------------------------------------//
gulp.task('collecticons', function (done) {
  var args = [
    'node_modules/collecticons-processor/bin/collecticons.js',
    'compile',
    'app/assets/graphics/collecticons/',
    '--font-embed',
    '--font-dest', 'app/assets/fonts',
    '--font-name', 'Collecticons',
    '--font-types', 'woff',
    '--style-format', 'sass',
    '--style-dest', 'app/assets/styles/',
    '--style-name', 'collecticons',
    '--class-name', 'collecticons',
    '--author-name', 'MapLesotho',
    '--author-url', 'https://maplesotho.com/',
    '--no-preview'
  ];

  return cp.spawn('node', args, {stdio: 'inherit'})
    .on('close', done);
});

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- OAM icons tasks ---------------------------------//
// -------------------- (Font generation related) ----------------------------//
// ---------------------------------------------------------------------------//
gulp.task('oam:icons', function (done) {
  var args = [
    'node_modules/collecticons-processor/bin/collecticons.js',
    'compile',
    'app/assets/icons/',
    '--font-embed',
    '--font-dest', 'app/assets/fonts',
    '--font-name', 'OAM DS Icons',
    '--font-types', 'woff',
    '--style-format', 'sass',
    '--style-dest', 'app/assets/styles',
    '--style-name', 'oam-ds-icons',
    '--class-name', 'oam-ds-icon',
    '--author-name', 'Development Seed',
    '--author-url', 'https://developmentseed.org/',
    '--no-preview'
  ];

  return cp.spawn('node', args, {stdio: 'inherit'})
    .on('close', done);
});


// Compiles the user's script files to bundle.js.
// When including the file in the index.html we need to refer to bundle.js not
// main.js
gulp.task('javascript', function () {
  var watcher = watchify(browserify({
    entries: ['./app/assets/scripts/main.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  function bundler () {
    if (pkg.dependencies) {
      watcher.external(Object.keys(pkg.dependencies));
    }
    return watcher.bundle()
      .on('error', function (e) {
        notifier.notify({
          title: 'Oops! Browserify errored:',
          message: e.message
        });
        console.log('Javascript error:', e);
        if (prodBuild) {
          process.exit(1);
        }
        // Allows the watch to continue.
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      // Source maps.
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/assets/scripts'))
      .pipe(reload({stream: true}));
  }

  watcher
  .on('log', gutil.log)
  .on('update', bundler);

  return bundler();
});

// Vendor scripts. Basically all the dependencies in the package.js.
// Therefore be careful and keep the dependencies clean.
gulp.task('vendorScripts', function () {
  // Ensure package is updated.
  readPackage();
  var vb = browserify({
    debug: true,
    require: pkg.dependencies ? Object.keys(pkg.dependencies) : []
  });
  return vb.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/assets/scripts'))
    .pipe(reload({stream: true}));
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

  switch (process.NODE_ENV) {
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



gulp.task('serve', ['vendorScripts', 'oam:icons', 'javascript', 'styles', 'jekyll'], function () {
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


// After being rendered by jekyll process the html files. (merge css files, etc)
gulp.task('html', function () {
  var jkConf = YAML.load('_config.yml');
  return gulp.src('_site/**/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(/\.(css|js)$/, rev()))
    .pipe(revReplace({prefix: jkConf.baseurl}))
    .pipe(gulp.dest('_site'))
    .pipe($.size({title: 'build', gzip: true}))
    .pipe(exit());
});


gulp.task('default', ['clean'], function () {
  prodBuild = true;
  gulp.start('build');
});

// gulp.task('build', function(done) {
//   runSequence(['vendorScripts', 'oam:icons', 'jekyll', 'javascript', 'styles', 'copy:assets', 'html'], done)
// });

// gulp.task('html', function() {
//   runSequence(['vendorScripts', 'oam:icons', 'javascript', 'styles', 'jekyll'], done);
// });

gulp.task('build', function () {
  gulp.start(['vendorScripts', 'oam:icons', 'javascript', 'styles', 'jekyll'], function () {
    gulp.start(['html'], function () {
      return gulp.src('_site/**/*')
        .pipe($.size({title: 'build', gzip: true}))
        .pipe(exit());
    });
  });
});