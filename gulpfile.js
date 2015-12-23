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
        js: 'src/api.js'
    },
    test: {
        cases: 'test/**/*.test.js',
        runner: 'test/api.test.html'
    }
};

gulp.task('uglify', function() {
    return gulp.src(sources.src.js).pipe(plugins.plumber()).pipe(plugins.uglify()).pipe(plugins.rename({
        suffix: '.min'
    })).pipe(gulp.dest('build'));
});

gulp.task('mocha', function() {
    return gulp.src(sources.test.runner).pipe(plugins.plumber()).pipe(plugins.mocha());
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['mocha']);
    gulp.watch(sources.test.cases, ['mocha']);
    return gulp.watch(sources.test.runner, ['mocha']);
});

gulp.task('build', sync(['mocha', 'uglify']));
