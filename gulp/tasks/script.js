/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 15/09/30 - 21:44
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * for practice_video_api
 */
/*jslint node: true */
/*jslint -W079 */
"use strict";

// setting
var setting = require( '../setting.js' );

// package.json
var pkg = setting.pkg;
var version = pkg.version;

// gulp / gulp-load-plugins
var gulp = setting.gulp;
var $ = setting.$;

// module
var $$ = setting.module;

var del = $$.del;
var runSequence = $$.runSequence;

// directory
var dir = setting.dir;
var app = dir.app;
var tmp = dir.tmp;
var htdocs = dir.htdocs;

// css prefix
var AUTO_PREFIX_BROWSERS = setting.AUTO_PREFIX_BROWSERS;

// replace task patterns
var patterns = setting.patterns;

// ------------------------------------------------------
// scripts

var libName = 'doga.js';
var scripts = [];

scripts.push( dir.src + '/doga.js' );

// event
scripts.push( dir.src + '/event/EventDispatcher.js' );

// ui
scripts.push( dir.src + '/ui/Cue.js' );
scripts.push( dir.src + '/ui/Player.js' );

// ------------------------------------------------------
// tasks
// ------------------------------------------------------

// move old folder
gulp.task( 'script-move-old', function () {

  return gulp.src( dir.libs + '/*' )
    .pipe( gulp.dest( dir.old ) )
    .pipe( $.size( { title: '*** script-move-old ***' } ) );

} );

gulp.task( 'script-clean-libs', function () {

  del(
    [
      dir.libs + '/*'
    ],
    {
      base: process.cwd(),
      dot: true,
      force: true
    },
    function (err, deletedFiles) {
      console.log('files deleted:' + deletedFiles.length + "\n" + deletedFiles.join("\n"));
    } );

} );

// build
gulp.task( 'script-min', function () {

  return gulp.src( scripts )
    .pipe( $.concat( libName ) )
    .pipe( $.replaceTask( { patterns: patterns } ) )
    // concat libName
    .pipe( gulp.dest( dir.libs ) )
    .pipe( $.rename( function ( path ) {

      path.basename = path.basename + '-' + version;

    } ) )
    // concat libName-version
    .pipe( gulp.dest( dir.libs ) )
    .pipe( $.uglify( { preserveComments: 'some' } ) )
    .pipe( $.rename( { suffix: '.min' } ) )
    // minified libName-version.min
    .pipe( gulp.dest( dir.libs ) )
    .pipe( $.rename( function ( path ) {

      path.basename = path.basename.replace( '-' + version, '' );

    }) )
    // min libName.min
    .pipe( gulp.dest( dir.libs ) )
    .pipe( $.size( { title: '*** script-min ***' } ) );

} );


// Lint JavaScript
gulp.task('script-hint', function () {
  return gulp.src( [
    dir.src + '/**/*.js'
  ] )
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

// ------------------------------------------------------

gulp.task( 'script-build', function () {

  runSequence(
    'script-hint',
    'script-move-old',
    'script-clean-libs',
    'script-min'
  );

} );