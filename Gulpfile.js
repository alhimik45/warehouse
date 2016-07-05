var gulp = require("gulp");
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var browserify = require('gulp-browserify');
var intermediate = require('gulp-intermediate');

var ts_path = 'src/ts/**/*.ts';
var typings_path = 'typings/**/*.d.ts';
var scss_path = 'src/scss/**/*.scss';
var pug_path_compile = 'src/pug/**/!(_)*.pug';
var pug_path_watch = 'src/pug/**/*.pug';

gulp.task("scss", function () {
    return gulp.src(scss_path)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css'));
});

gulp.task("pug", function () {
    return gulp.src(pug_path_compile)
        .pipe(
            pug({pretty: '\t'}).on('error', function (e) {
                console.log('Pug error: ' + e.message);
                this.emit('end');
            }))
        .pipe(gulp.dest('./build'));
});

gulp.task('typescript', function () {
    return gulp.src([ts_path, typings_path])
        .pipe(ts({
            noImplicitAny: true,
            target: 'ES5',
            module: 'commonjs',
        }))
        .pipe(intermediate({output: '_js_tmp'}, function (tempDir, cb) {
            gulp.src(tempDir + '/main.js')
                .pipe(browserify({
                    debug: true
                }).on('error', function (e) {
                    console.log('Pug error: ' + e.message);
                    this.emit('end');
                }))
                .pipe(gulp.dest('./build/js'))

                .on('end', cb);

        }));
});


gulp.task("watch", function () {
    gulp.watch(scss_path, ['scss']);
    gulp.watch(ts_path, ['typescript']);
    gulp.watch(pug_path_watch, ['pug']);
});
