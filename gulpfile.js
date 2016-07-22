var gulp          = require('gulp');
var async         = require('async');
var base64        = require('gulp-base64');
var consolidate   = require('gulp-consolidate');
var del           = require('del');
var fs            = require('fs');
var iconfont      = require('gulp-iconfont');
var path          = require('path');
var rename        = require('gulp-rename');
var runSequence   = require('run-sequence');


// Methods
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}


// Clean
gulp.task('clean', function(fn) {
  return del(['dist/**/*'], fn);
});

gulp.task('clean-woff', function(fn) {
  return del(['dist/**/*.woff'], fn);
});



// Font Icon Building
gulp.task('font-icon', function(fn) {
  var directories= getFolders('src');

  directories.forEach(function(dir, index) {
    var iconName = dir;
    var srcPath = path.join('src', dir, '*.svg');
    var destPath = path.join('dist', dir);

    var iconStream = gulp.src(srcPath)
      .pipe(iconfont({
        fontHeight: 1200,
        fontName: iconName,
        formats: ['woff', 'eot'],
        normalize: true
      }));

    async.parallel([
      function handleGlyphs (cb) {
        // HTML + MD
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
          .pipe(gulp.dest(destPath + '/fonts'))
          .on('end', function() {
            // Base64 font injection
            var _destPath = destPath + '/';
            generateBase64(_destPath, '*.css');
            generateBase64(_destPath, '*.scss');
            gulp.start('clean-woff');
          });
      }
    ]);
  });
});


// Generate Base64
var generateBase64 = function(path, file) {
  if(!path || !file) {
    return false;
  }

  return gulp.src(path + file)
    .pipe(base64({
      extensions: ['woff', 'eot'],
      maxImageSize: 500000
    }))
    .pipe(gulp.dest(path));
};



// Watch
gulp.task('watch', function() {
  gulp.watch(['src/**/*.svg'],
    ['generate-font']);
});



// Build tasks
gulp.task('generate-font', function(fn) {
  runSequence('clean', 'font-icon', fn);
});


// Tasks
gulp.task('default', ['generate-font']);
