var async         = require('async');
var gulp          = require('gulp');
var iconfont      = require('gulp-iconfont');
var iconfontCss   = require('gulp-iconfont-css');
var runTimestamp  = Math.round(Date.now()/1000);
var del           = require('del');
var consolidate   = require('gulp-consolidate');


// Clean
gulp.task('clean-app', function(fn) {
  return del(['dist/app'], fn);
});

gulp.task('clean-custom-app', function(fn) {
  return del(['dist/custom-app'], fn);
});


// Icon fonts
var iconAppName = 'hs-app-icon';
var iconCustomAppName = 'hs-custom-app-icon';


gulp.task('iconfont-app', ['clean-app'], function(){
  gulp.src(['src/app/*.svg'])
    .pipe(iconfontCss({
      fontName: iconAppName,
      path: 'templates/_icons.scss',
      targetPath: '_icons.scss',
      cssClass: 'icon'
    }))
    .pipe(iconfont({
      fontName: iconAppName
     }))
    .pipe(gulp.dest('dist/app/'));

  gulp.src(['src/app/*.svg'])
    .pipe(iconfontCss({
      fontName: iconAppName,
      targetPath: 'icons.css',
      fontPath: '',
      cssClass: 'icon'
    }))
    .pipe(iconfont({
      fontName: iconAppName
     }))
    .pipe(gulp.dest('dist/app/'));
});


gulp.task('iconfont-custom-app', ['clean-custom-app'], function(){
  gulp.src(['src/custom-app/*.svg'])
    .pipe(iconfontCss({
      fontName: iconCustomAppName,
      path: 'templates/_icons.scss',
      targetPath: '_icons.scss',
      cssClass: 'icon'
    }))
    .pipe(iconfont({
      fontName: iconCustomAppName
     }))
    .pipe(gulp.dest('dist/custom-app/'));

  gulp.src(['src/custom-app/*.svg'])
    .pipe(iconfontCss({
      fontName: iconCustomAppName,
      targetPath: 'icons.css',
      fontPath: '',
      cssClass: 'icon'
    }))
    .pipe(iconfont({
      fontName: iconCustomAppName
     }))
    .pipe(gulp.dest('dist/custom-app/'));
});


gulp.task('test', function(done) {
  var iconStream = gulp.src(['src/app/*.svg'])
    .pipe(iconfont({ fontName: 'myfont' }));

  async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function(glyphs, options) {
        gulp.src('templates/preview.html')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'myfont',
            className: 's'
          }))
          .pipe(gulp.dest('dist/app/'))
          .on('finish', cb);
      });
    }
  ], done);
});



// Tasks
gulp.task('default', ['iconfont-app', 'iconfont-custom-app']);
