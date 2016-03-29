var gulp          = require('gulp');
var fs            = require('fs');
var path          = require('path');
var async         = require('async');
var iconfont      = require('gulp-iconfont');
var iconfontCss   = require('gulp-iconfont-css');
var del           = require('del');
var consolidate   = require('gulp-consolidate');


// Methods
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}


// Clean
gulp.task('clean', function(fn) {
  return del(['dist'], fn);
});

gulp.task('clean-app', function(fn) {
  return del(['dist/app'], fn);
});

gulp.task('clean-custom-app', function(fn) {
  return del(['dist/custom-app'], fn);
});


// Font Icon Building
gulp.task('iconfont', ['clean'], function() {
  var directories= getFolders('src');
  
  directories.forEach(function(dir) {
    var iconName = 'hs-' + dir;
    var srcPath = path.join('src', dir, '*.svg');
    var destPath = path.join('dist', dir);

    var iconStream = gulp.src(srcPath)
      .pipe(iconfont({ 
        fontName: iconName,
        formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
      }));

    // HTML + MD
    async.parallel([
      function handleGlyphs (cb) {
        iconStream.on('glyphs', function(glyphs, options) {

          // SCSS
          gulp.src('templates/_icons.scss')
            .pipe(consolidate('lodash', {
              glyphs: glyphs,
              fontName: iconName,
              fontDir: dir,
              cssClass: 'icon'
            }))
            .pipe(gulp.dest(destPath));

          // CSS
          gulp.src('templates/icons.css')
            .pipe(consolidate('lodash', {
              glyphs: glyphs,
              fontName: iconName,
              fontDir: dir,
              cssClass: 'icon'
            }))
            .pipe(gulp.dest(destPath));

          // HTML
          gulp.src('templates/preview.html')
            .pipe(consolidate('lodash', {
              glyphs: glyphs,
              fontName: iconName
            }))
            .pipe(gulp.dest(destPath));

          // MD
          gulp.src('templates/icons.md')
            .pipe(consolidate('lodash', {
              glyphs: glyphs
            }))
            .pipe(gulp.dest(destPath));
        });
      },

      function handleFonts(cb) {
        iconStream
          .pipe(gulp.dest(destPath + '/fonts'));
      }
    ]);

  });
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
          .pipe(gulp.dest('dist/app/'));

        gulp.src('templates/icons.md')
          .pipe(consolidate('lodash', {
            glyphs: glyphs
          }))
          .pipe(gulp.dest('dist/app/'))
          .on('finish', cb);
      });
    }
  ], done);
});



// Watch
gulp.task('watch', function() {
  gulp.watch(['src/**/*.svg'],
    ['iconfont']);
});


// Tasks
gulp.task('default', ['iconfont', 'watch']);
