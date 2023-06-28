var gulp        = require('gulp');
    sass        = require('gulp-sass')(require('sass'));
    prefixer    = require('gulp-autoprefixer');
    browsersync = require('browser-sync');
    cleancss	= require('gulp-clean-css');
    sourcemaps	= require('gulp-sourcemaps');
    webp        = require('gulp-webp');
    imagemin    = require('gulp-imagemin');
    svgSprite   = require('gulp-svg-sprite');
    favicons    = require('gulp-favicons');

gulp.task('sass', function(){
    return gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer(['last 4 versions']))
        .pipe(cleancss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(browsersync.reload({stream: true}))
});

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build'))
        .pipe(browsersync.reload({ stream: true }))
});

gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(gulp.dest('build/js'))
        .pipe(browsersync.reload({ stream: true }))
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'))
        .pipe(browsersync.reload({ stream: true }))
});

gulp.task('images', function() {
    return gulp.src('src/img/*.{jpg,jpeg,png,svg}')
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 50, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
        ]))
        .pipe(gulp.dest('build/img'))
        .pipe(browsersync.reload({ stream: true }))
});

gulp.task('towebp', function () {
    return gulp.src('src/img/*.{jpg,jpeg,png}')
        .pipe(webp())
        .pipe(gulp.dest('build/img'))
        .pipe(browsersync.reload({ stream: true }))
});

gulp.task('svg-sprite', function () {
    return gulp.src('src/img/icons-sprite/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"  //sprite file name
                },
                symbol: true
            },
        }))
        .pipe(gulp.dest('build/img/icons-sprite'))
        .pipe(browsersync.reload({ stream: true }))
});

var favicons = require('gulp-favicons');

gulp.task('favicon', function () {
    return gulp.src('src/img/logo.png')
    .pipe(
        favicons({
            appName: 'Query',
            appShortName: 'Qyery',
            appDescription: 'This is my application',
            developerName: '',
            developerURL: '',
            background: '#ffffff',
            path: './',
            url: '/',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/?homescreen=1',
            version: 1.0,
            logging: false,
            html: 'build/index.html',
            pipeHTML: true,
            replace: true,
        })
    )
    .pipe(gulp.dest('build/favicon'));
});

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('src/*.html', gulp.parallel('html'));
    gulp.watch('src/js/*.js', gulp.parallel('js'));
    gulp.watch('src/fonts/*.*', gulp.parallel('fonts'));
    gulp.watch('src/img/*.svg', gulp.parallel('svg-sprite'));
    gulp.watch('src/img/*.{jpg,jpeg,png,svg}', gulp.parallel('images'));
    gulp.watch('src/img/*.{jpg,jpeg,png}', gulp.parallel('towebp'));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browsersync({
        server: {
            baseDir: 'build'
        },
        notify: false
    });
});

exports.browsersync = browsersync;

gulp.task('default', gulp.parallel('watch'));

gulp.task('gulp-sync', gulp.parallel('sass', 'html', 'js', 'fonts', 'images', 'favicon', 'svg-sprite', 'browser-sync', 'watch'));
