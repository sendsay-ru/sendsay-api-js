gulp = require 'gulp'
plugins = require('gulp-load-plugins')
  rename:
    'gulp-mocha-phantomjs': 'mocha'
sync = (plugins.sync gulp).sync


sources =
  src:
    js: 'src/api.js'
  test:
    cases: 'test/**/*.test.js'
    runner: 'test/api.test.html'

gulp.task 'uglify', ->
  gulp.src sources.src.js
    .pipe do plugins.plumber
    .pipe do plugins.uglify
    .pipe plugins.rename
      suffix: '.min'
    .pipe gulp.dest 'build'

gulp.task 'mocha', ->
  gulp.src sources.test.runner
    .pipe do plugins.plumber
    .pipe do plugins.mocha

gulp.task 'watch', ->
  gulp.watch 'src/*.js', ['mocha']
  gulp.watch sources.test.cases, ['mocha']
  gulp.watch sources.test.runner, ['mocha']

gulp.task 'build', sync([
  'mocha'
  'uglify'
])