/* globals require, __dirname */

var gulp     = require('gulp');
var $        = require('gulp-load-plugins')();

var sequence = require('run-sequence');
var rimraf   = require('rimraf');

var CONFIG = {
    SOURCES: {
        APPLICATION_JS: [
            'scr/js/app.js',
            'src/js/**/*.js',
            '!src/js/**/*.spec.js'
        ],
        INDEX_FILE_TEMPLATE: "src/index.html",

        VENDOR_JS: [
            "bower_components/angular/angular.js"
        ]
    },
    DEPLOY_DIR: "build"
};

gulp.task("default", function(cb) {
    "use strict";
    sequence('build', 'watch', cb);
});

gulp.task('build', function(cb){
    "use strict";
    sequence('clean', ['3partyJS', 'js'], 'index', cb);
});

gulp.task("clean", function(cb) {
    "use strict";
    rimraf(CONFIG.DEPLOY_DIR, cb);
});

gulp.task("js", function () {
    "use strict";

    return gulp.src(CONFIG.SOURCES.APPLICATION_JS)
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.concat('all.js'))
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        //.pipe($.rev())
        .pipe($.sourcemaps.write("."))
        .pipe(gulp.dest(CONFIG.DEPLOY_DIR + '/js/'));
});

gulp.task('3partyJS', function() {
    "use strict";

    return gulp.src(CONFIG.SOURCES.VENDOR_JS)
        .pipe($.concat('vendor.js'))
        .pipe(gulp.dest(CONFIG.DEPLOY_DIR + '/js/3party/'))
    ;
});

gulp.task("index", function() {
    "use strict";

    var target = gulp.src(CONFIG.SOURCES.INDEX_FILE_TEMPLATE);
    var sources = gulp.src([
        CONFIG.DEPLOY_DIR+"/css/3party/*",
        CONFIG.DEPLOY_DIR+"/js/3party/*",
        CONFIG.DEPLOY_DIR+"/**/*"
    ], {read: false});

    return target.pipe($.inject(sources, {
            ignorePath : CONFIG.DEPLOY_DIR,
            addRootSlash: false
        }))
        .pipe(gulp.dest(CONFIG.DEPLOY_DIR));
});

gulp.task('watch', function() {
    "use strict";

    gulp.watch(CONFIG.SOURCES.APPLICATION_JS, ['js', 'index']);
    gulp.watch(CONFIG.SOURCES.INDEX_FILE_TEMPLATE, ['index']);

});