import gulp from "gulp";
import del from "del";
import image from "gulp-imagemin";
import ws from "gulp-webserver";
import include from 'gulp-file-include';
import gulphtmlInclude from 'gulp-html-tag-include';


// sass 설정 
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require('gulp-sourcemaps');
var scssOptions = {
    outputStyle : "expanded",
    indentType : "tab",
    indentWidth : 1, // outputStyle 이 nested, expanded 인 경우에 사용
    precision: 6,
    sourceComments: true
};

// 경로 설정 
const routes ={
    html:{
        watch:"src/html/**",
        src:"src/html/**",
        dest:"build"
    },
    img:{
        watch:"src/images/**",
        src:"src/images/**",
        dest:"build/images"
    },
    sass:{
        watch:"src/sass/**",
        src:"src/sass/*.scss",
        dest:"build/css",
        src2:"src/sass/**",
        dest2:"build/scss"
    },
    js:{
        watch:"src/js/*",
        src:"src/js/*",
        dest:"build/js"
    },
    lib:{
        src:"src/lib/*",
        dest:"build/lib"
    },
    font:{
        src:"src/fonts/**",
        dest:"build/fonts"
    }
}

const clean = ()=> 
    del(["build"]);

const html =()=>
    gulp
        .src(routes.html.src)
        .pipe(include())
        .pipe(gulphtmlInclude())
        .pipe(gulp.dest(routes.html.dest));

const img  =()=>
     gulp
        .src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest));

const style =()=>
    gulp.src(routes.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass(scssOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(routes.sass.dest))

const styleSass = ()=>
    gulp.src(routes.sass.src2)
        .pipe(gulp.dest(routes.sass.dest2))

const js = () =>
    gulp.src(routes.js.src)
        .pipe(gulp.dest(routes.js.dest))

const lib = ()=>
    gulp.src(routes.lib.src)
        .pipe(gulp.dest(routes.lib.dest))

const font = ()=>
    gulp.src(routes.font.src)
        .pipe(gulp.dest(routes.font.dest))

const webserver = () =>
    gulp
        .src("build")
        .pipe(ws({livereload:true, open:true}));

const watch =()=>
    gulp.watch(routes.img.watch, img)
    gulp.watch(routes.html.watch, html)
    gulp.watch(routes.sass.watch, style)
    gulp.watch(routes.js.watch, js)

const lastCheck = ()=>
    del(["build/include"]);

const prepare = gulp.series([clean,img,font]);
const assets = gulp.series([html,style,styleSass,js,lib]);
const postDev = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare,assets,lastCheck]);
export const dev = gulp.series([prepare,assets,postDev]);