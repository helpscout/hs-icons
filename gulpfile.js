var gulp          = require('gulp');
var iconfont      = require('gulp-iconfont');
var iconfontCss   = require('gulp-iconfont-css');
var runTimestamp  = Math.round(Date.now()/1000);
var del           = require('del');


// Clean
gulp.task('clean-app', function(fn) {
  return del(['dist/app'], fn);
});

gulp.task('clean-custom-app', function(fn) {
  return del(['dist/custom'], fn);
});


// Icon fonts
var iconAppName = 'hs-app-icon';
var iconCustomAppName = 'hs-custom-app-icon';


gulp.task('iconfont-app', ['clean-app'], function(){
  gulp.src(['src/app/*.svg'])
    .pipe(iconfontCss({
      fontName: iconAppName,
      targetPath: 'icons.css',
      fontPath: '/dist/app/',
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
      targetPath: 'icons.css',
      fontPath: '/dist/custom-app/',
      cssClass: 'icon'
    }))
    .pipe(iconfont({
      fontName: iconCustomAppName
     }))
    .pipe(gulp.dest('dist/custom-app/'));
});




// Tasks
gulp.task('default', ['iconfont-app', 'iconfont-custom-app']);
