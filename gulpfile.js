var
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  preprocess = require('gulp-preprocess'),
  htmlclean = require('gulp-htmlclean'),
  sass = require('gulp-sass'),
  imacss = require('gulp-imacss'),
  pleeease = require('gulp-pleeease'),
  deporder = require('gulp-deporder'),
  concat = require('gulp-concat'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  pkg = require('./package.json'),
  source = 'source/',
  dest = 'build/';

var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');
// false if 'production', true if 'development' (or anything else).
console.log(devBuild ? '***Development Build***' : '***Production Build***');

var
  html = {
    in: source + '*.html',
    watch: [source + '*.html', source + 'partials/**/*'],
    out: dest,
    context: {
      devBuild: devBuild,
      author: pkg.author
    }
  },

  images = {
    in: source + 'images/*.*',
    out: dest + 'images/'
  },

  imguri = {
    in: source + 'images/inline/*',
    out: source + 'scss/images/',
    filename: '_datauri.scss',
    namespace: 'img'
  },

  css = {
    in: source + 'scss/master.scss',
    watch: [source + 'scss/**/*', '!' + imguri.out + imguri.filename],
    out: dest + 'css/',
    sassOpts: {
      outputStyle: 'nested',
      imagePath: '../images',
      precision: 3,
      errLogToConsole: true
    },
    pleeeaseOpts: {
      /* auto css browser prefix for last 2 versions of major browsers and anything
      browser with more than 2% market share */
      autoprexixer: {browsers: ['last 2 versions', '> 2%']},
      rem: ['16px'],
      // support IE < version 8. Changes double colons to single
      pseudoElements: true,
      // packs multiple media queries with same dimensions into single query
      mqpacker: true,
      minifier: !devBuild
    }
  },

  js = {
    in: source + 'js/**/*',
    out: dest + 'js/',
    filename: 'main.js'
  };

// Preprocess HTML
gulp.task('html', function() {
  var page = gulp.src(html.in)
    .pipe(preprocess({context: html.context}));

  if (!devBuild) {
    // minify if not development build
    page = page.pipe(htmlclean());
  };

  return page.pipe(gulp.dest(html.out));
});

// Preprocess SASS
gulp.task('sass', ['imguri'], function() {
  return gulp.src(css.in)
    .pipe(sass(css.sassOpts))
    .pipe(pleeease(css.pleeeaseOpts))
    .pipe(gulp.dest(css.out));
});

// Compress images
gulp.task('images', function() {
  return gulp.src(images.in)
    .pipe(newer(images.out)) // only process images once
    .pipe(imagemin())
    .pipe(gulp.dest(images.out));
});

// Convert images to data URIs
gulp.task('imguri', function() {
  return gulp.src(imguri.in)
    .pipe(imagemin())
    .pipe(imacss(imguri.filename, imguri.namespace))
    .pipe(gulp.dest(imguri.out));
});

// JavaScript task
gulp.task('js', function() {
  if (devBuild) {
    return gulp.src(js.in)
      .pipe(newer(js.out)) //only process JS files once
      //Linter can go here (optional)
      .pipe(gulp.dest(js.out));
  } else {
    del([dest + 'js/*']);
    return gulp.src(js.in)
      .pipe(deporder()) // puts scripts in right order
      .pipe(concat(js.filename))
      .pipe(stripdebug()) // removes debug and console.log etc
      .pipe(uglify()) // minify JS
      .pipe(gulp.dest(js.out));
  }
});

// clean the build dir
gulp.task('clean', function() {
  del([dest + '*']);
});

// Default task
gulp.task('default', ['html', 'images', 'sass', 'js'], function() {

  // watch for html changes in source
  gulp.watch(html.watch, ['html']);

  // watch for image changes in source
  gulp.watch(images.in, ['images']);

  // watch for sass changes in source
  gulp.watch([css.watch, imguri.in], ['sass']);

  // watch for javascript changes in source
  gulp.watch(js.in, ['js']);

});
