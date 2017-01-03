// //////////////////////////////////////////////////////
// Required
// //////////////////////////////////////////////////////

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');

// //////////////////////////////////////////////////////
// Scripts Task
// //////////////////////////////////////////////////////
gulp.task('scripts', function(){
    gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({suffix:'.min'}))
    // .pipe(concat('app.min.js'))
    .pipe(gulp.dest('app/js/'))
    .pipe(reload({stream:true}));
});

// //////////////////////////////////////////////////////
// Compass / Sass Tasks
// //////////////////////////////////////////////////////
gulp.task('sass', function(){
    gulp.src('app/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('app/css'))
    .pipe(reload({stream:true}));
});

// //////////////////////////////////////////////////////
// Browser-Sync Tasks
// //////////////////////////////////////////////////////
gulp.task('browser-sync', function(){
    browserSync({
        server:{
            baseDir: "./app/"
        }
    });
});

// task to run build server for testing final app
gulp.task('build:serve', function(){
    browserSync({
        server:{
            baseDir: "./build/"
        }
    });
});

// //////////////////////////////////////////////////////
// HTML Tasks
// //////////////////////////////////////////////////////
gulp.task('html', function(){
    gulp.src('app/**/*.html')
    .pipe(reload({stream:true}));
});

// //////////////////////////////////////////////////////
// Build Tasks
// //////////////////////////////////////////////////////

// Clear out all files and folders from build folder
gulp.task('build:cleanfolder', function(cb){
    del([
        'build/**'
    ], cb);
});

// Task to create build directory for all files.
gulp.task('build:copy', function(){
    return gulp.src('app/**/*/')
    .pipe(gulp.dest('build/'));
});

// Task to remove unwanted build files
// List all files and directories here that you don't want to include
gulp.task('build:remove', ['build:copy'], function(cb){
    del([
        'build/scss/',
        // 'build/js/!(app.min.js)'
        'build/js/!(*.min.js)'
    ], cb);
});

gulp.task('build', ['build:copy', 'build:remove', 'build:serve']);

// //////////////////////////////////////////////////////
// Watch Tasks
// //////////////////////////////////////////////////////
gulp.task('watch', function(){
    gulp.watch('app/js/**/*.js', ['scripts']);
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', ['html']);
});

// //////////////////////////////////////////////////////
// Default Task
// //////////////////////////////////////////////////////
gulp.task('default', ['scripts', 'sass', 'html', 'browser-sync', 'watch']);
