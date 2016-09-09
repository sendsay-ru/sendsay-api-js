var gulp, plugins, sources, sync;

gulp = require('gulp');

plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-mocha-phantomjs': 'mocha'
    }
});

sync = (plugins.sync(gulp)).sync;

sources = {
    src: {
        js: 'src/*.js'
    },
    test: {
        cases: 'test/**/*.test.js',
        runner: 'test/api.test.html'
    }
};

gulp.task('test', function() {
  return gulp.src(sources.test.runner).pipe(plugins.plumber()).pipe(plugins.mocha());
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['test']);
    gulp.watch(sources.test.cases, ['test']);
    return gulp.watch(sources.test.runner, ['test']);
});
