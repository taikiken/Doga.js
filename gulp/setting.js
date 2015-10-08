/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 15/04/19
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 */
/*jslint node: true */
/*jslint -W079 */
'use strict';

// ------------------------------------------------------
// package
var pkg = require( './package.json' );

var repository = pkg.repository.url;

// ------------------------------------------------------
// Node / Gulp module
// ------------------------------------------------------

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pageSpeed = require('psi');
var reload = browserSync.reload;

// ------------------------------------------------------
// Sass prefix 設定
var AUTO_PREFIX_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// ----------------------------------------------------------------
//  patterns
var patterns = [
  {
    match: 'buildTime',
    replacement: new Date().toLocaleString()
  },
  {
    match: 'year',
    replacement: new Date().getFullYear()
  },
  {
    match: 'version',
    replacement: pkg.version
  },
  {
    match: 'repository',
    replacement: repository
  }
];

// ------------------------------------------------------
// directory
// ------------------------------------------------------

var app = '../example';

var scss = '../scss';

var htdocs = '../htdocs';

var tmp = '../.tmp';

// js directory
var js = '../';
var src = js + '/src';
var docs = js + '/docs';
var libs = js + '/libs';
var dependencies = js + '/dependencies';

// server directory indexes
// indexes, directory indexes を有効にします
// * 【注意】directory index が無効になってしまうので default false にしてます
var indexes = false;

// ------------------------------------------------------
// server
// ------------------------------------------------------
// *【注意】 port は project 毎に変更して下さい
var port = '60000';

// ------------------------------------------------------
// exports
// ------------------------------------------------------
module.exports = {
  dir: {
    app: app,
    htdocs: htdocs,
    scss: scss,
    tmp: tmp,

    js: js,
    src: src,
    libs: libs,
    old: js + '/old',
    dependencies: dependencies,
    docs: docs
  },
  gulp: gulp,
  $: $,
  indexes: indexes,
  pkg: pkg,
  module: {
    del: del,
    runSequence: runSequence,
    browserSync: browserSync,
    pageSpeed: pageSpeed,
    reload: reload
  },
  AUTO_PREFIX_BROWSERS: AUTO_PREFIX_BROWSERS,
  patterns: patterns,
  port: port
};
