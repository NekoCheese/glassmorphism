const { src, dest, series, parallel, watch } = require("gulp");

const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const fileinclude = require("gulp-file-include");
const browserSync = require("browser-sync");
const reload = browserSync.reload;
const babel = require("gulp-babel");
const clean = require("gulp-clean");

//html
function includeHTML() {
  return src("*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./dist"));
}
exports.html = includeHTML;

//sass
function sassstyle() {
  return src("sass/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(sourcemaps.write())
    .pipe(dest("dist/css"));
}
exports.style = sassstyle;

//js
function Jsminify() {
  return src("js/*.js")
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest("dist/js"));
}
exports.uglify = Jsminify;

// 降轉 babel es6 - > es5
function babel5() {
  return src("js/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(dest("dist/js"));
}
exports.js_update = babel5;

//搬家
function img_move() {
  return src(["images/*.*", "images/**/*.*"]).pipe(dest("dist/images"));
}

// 清除舊檔案
function clear() {
  return src("dist", { read: false, allowEmpty: true }).pipe(
    clean({ force: true })
  );
}
exports.cls = clear;

// 瀏覽器同步
function browser(done) {
  browserSync.init({
    server: {
      baseDir: "./dist",
      index: "index.html",
    },
    port: 3000,
  });
  watch(["*.html", "layout/*.html"], includeHTML).on("change", reload);
  watch(["sass/*.scss", "sass/**/*.scss"], sassstyle).on("change", reload);
  watch(["images/*.*", "images/**/*.*"], img_move).on("change", reload);
  watch("js/*.js", Jsminify).on("change", reload);
  done();
}

//執行
exports.default = series(
  parallel(includeHTML, sassstyle, img_move, Jsminify),
  browser
);

// 上線
exports.online = series(
  clear,
  parallel(includeHTML, sassstyle, img_move, babel5)
);
