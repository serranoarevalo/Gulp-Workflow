// ///////////////////////
// Required
// ///////////////////////

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	del = 	require('del'),
	jade = require('gulp-jade'),
	imageop = require('gulp-image-optimization'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	rename = require('gulp-rename');

// ///////////////////////
// Scripts Tasks
// ///////////////////////

gulp.task('scripts', function() {
	gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
		.pipe(plumber())
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(reload({stream:true}));
});

// ///////////////////////
// Sass Tasks
// ///////////////////////

gulp.task('sass', function() {
	gulp.src('app/scss/**/*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('app/css/'))
		.pipe(reload({stream:true}));
});

// ///////////////////////
// Jade Tasks
// ///////////////////////

gulp.task('templates', function() {
	gulp.src('app/templates/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('app'))
})

// ///////////////////////
// Html Tasks
// ///////////////////////

gulp.task('html', function() {
	gulp.src('app/**/*.html')
		.pipe(gulp.dest('app/'))
		.pipe(reload({stream:true}));
});

// ///////////////////////
// Image Optimization Tasks
// ///////////////////////

gulp.task('images', function(cb) {
	gulp.src(['app/images/*.png', 'app/images/*.jpg', 'app/images/*.gif', 'app/images/*.jpeg'])
		.pipe(imageop({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('app/img'));
})


// ///////////////////////
// Browser-sync Tasks
// ///////////////////////

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "app"
		}
	});
});

gulp.task('build:serve', function() {
	browserSync({
		server: {
			baseDir: "build"
		}
	});
});

// ///////////////////////
// Watch Tasks
// ///////////////////////

gulp.task('watch', function() {
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/templates/*.jade', ['templates']);
	gulp.watch('app/**/*.html', ['html']);
});

// ///////////////////////
// Build Tasks
// ///////////////////////

// Task to clear all the files and folders from build folder

gulp.task('build:cleanfolder', function() {
	del([
		'build/**'
	]);
});

// Task to create build directory for all files

gulp.task('build:copy', ['build:cleanfolder'], function() {
	return gulp.src('app/**/*')
	.pipe(gulp.dest('build/'));
})

// Task to remove all unwanted files from the build

gulp.task('build:remove', ['build:copy'],  function(cb) {
	del([
		'build/scss/',
		'build/js/!(*.min.js)',
		'build/templates/'
	], cb);
});

gulp.task('build', ['build:copy', 'build:remove']);

// ///////////////////////
// Default Task
// ///////////////////////

gulp.task('default', ['scripts', 'watch', 'sass', 'html', 'browser-sync','templates']);