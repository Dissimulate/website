'use strict'

const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const sass = require('gulp-sass')
const nodemon = require('gulp-nodemon')
const webpack = require('webpack-stream')
const prefix = require('gulp-autoprefixer')

const BUILD_DIR = path.resolve(__dirname, 'public')
const APP_DIR = path.resolve(__dirname, 'app')

let nodeModules = {}

fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod
  })

gulp.task('styles', () => {
  gulp.src(APP_DIR + '/styles/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix('last 10 versions'))
    .pipe(gulp.dest(BUILD_DIR))
})

gulp.task('transpile', () => {
  gulp.src(APP_DIR + '/index.js')
    .pipe(webpack({
      output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?/,
          include: APP_DIR,
          loader: 'babel'
        }]
      }
    }))
    .pipe(gulp.dest(BUILD_DIR))

  gulp.src(APP_DIR + '/server/index.js')
    .pipe(webpack({
      target: 'node',
      node: {
        __dirname: false,
        __filename: false
      },
      externals: nodeModules,
      output: {
        path: BUILD_DIR,
        filename: 'server.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?/,
          include: APP_DIR,
          loader: 'babel'
        }]
      }
    }))
    .pipe(gulp.dest(BUILD_DIR))
})

gulp.task('serve', function () {
  nodemon({
    script: BUILD_DIR + '/server.js',
    watch: [BUILD_DIR + '/server.js'],
    ext: 'js'
  })
})

gulp.task('move', () => {
  gulp.src([APP_DIR + '/fonts/*']).pipe(gulp.dest(BUILD_DIR + '/fonts'))
})

gulp.task('default', ['styles', 'transpile', 'move', 'serve'], function () {
  gulp.watch(APP_DIR + '/styles/**/*.scss', ['styles'])
  gulp.watch(APP_DIR + '/**/*.js', ['transpile'])
})

gulp.task('build', ['styles', 'transpile', 'move'])
