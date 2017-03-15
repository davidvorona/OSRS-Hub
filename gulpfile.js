const gulp = require("gulp");
const plugins = require("gulp-load-plugins")();
const del = require("del");
const es = require("event-stream");
const bowerFiles = require("main-bower-files");
const babel = require("gulp-babel");
const angularFilesort = require("gulp-angular-filesort");
const series = require("stream-series");
const image = require("gulp-image");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");

const paths = {
    scripts: ["public/*.js", "public/**/controllers/*.js", "public/**/factories/*.js",
        "public/**/services/*.js"],
    styles: "public/styles.css",
    index: "public/index.html",
    partials: ["public/**/*.html", "!public/index.html"],
    images: ["public/img/favicon-96x96.png", "public/img/rsbackground.png",
        "public/img/osrs_logo.png", "public/img/gnome_child.png"],
    distDev: "./dev",
    distDevStatic: "./dev/static",
    distProd: "./prod",
    distProdStatic: "./prod/static",
    distScriptsProd: "./prod/static/scripts",
    scriptsDevServer: "backend/**/*.js"
};

const pipes = {};

// validators

pipes.validatedAppScripts = () =>
    gulp.src(paths.scripts)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format());

pipes.validatedPartials = () =>
    gulp.src(paths.partials)
      .pipe(plugins.htmlhint({ "doctype-first": false }))
      .pipe(plugins.htmlhint.reporter());

pipes.validatedIndex = () =>
    gulp.src(paths.index)
      .pipe(plugins.htmlhint())
      .pipe(plugins.htmlhint.reporter());

pipes.validatedDevServerScripts = () =>
    gulp.src(paths.scriptsDevServer)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format());

// ***** DEV ONLY ***** //

pipes.orderedVendorScripts = () =>
    plugins.order(["angular.js", "angular-route", "angular-mock", "angular-smart-table"]);

pipes.builtDevImgs = () =>
    gulp.src(paths.images)
      .pipe(image())
      .pipe(gulp.dest("dev/static/img"));

pipes.builtVendorScriptsDev = () =>
    gulp.src(bowerFiles())
      .pipe(gulp.dest("dev/static/bower_components"));

pipes.builtAppScriptsDev = () =>
    pipes.validatedAppScripts()
      .pipe(babel({ presets: ["es2015"] }))
      .pipe(gulp.dest(paths.distDevStatic));

pipes.builtPartialsDev = () =>
    pipes.validatedPartials()
      .pipe(gulp.dest(paths.distDevStatic));

pipes.builtStylesDev = () =>
    gulp.src(paths.styles)
      .pipe(gulp.dest(paths.distDevStatic));

pipes.builtIndexDev = () => {
    const orderedVendorScripts = pipes.builtVendorScriptsDev()
      .pipe(pipes.orderedVendorScripts());
    const orderedAppScripts = pipes.builtAppScriptsDev()
      .pipe(angularFilesort());
    const appStyles = pipes.builtStylesDev();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDev)) // write first to get relative path for inject
        .pipe(plugins.inject(series(orderedVendorScripts, orderedAppScripts), { relative: true }))
        .pipe(plugins.inject(appStyles, { relative: true }))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtAppDev = () =>
    es.merge(pipes.builtIndexDev(), pipes.builtPartialsDev());

// ***** PROD ONLYS ***** //

pipes.minifiedFileName = () =>
    plugins.rename((path) => {
        path.extname = `.min${path.extname}`;
    });

pipes.builtProdImgs = () =>
    gulp.src(paths.images)
      .pipe(image())
      .pipe(gulp.dest("prod/static/img"));

pipes.builtVendorScriptsProd = () =>
    gulp.src(bowerFiles("**/*.js"))
      .pipe(pipes.orderedVendorScripts())
      .pipe(plugins.concat("vendor.min.js"))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(paths.distScriptsProd));

pipes.builtAppScriptsProd = () => {
    const scriptedPartials = pipes.scriptedPartials();
    const validatedAppScripts = pipes.validatedAppScripts();

    return es.merge(scriptedPartials, validatedAppScripts)
      .pipe(babel({ presets: ["es2015"] }))
      .pipe(angularFilesort())
      .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat("app.min.js"))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(paths.distScriptsProd));
};

pipes.scriptedPartials = () =>
    pipes.validatedPartials()
      .pipe(plugins.htmlhint.failReporter())
      .pipe(plugins.htmlhint({ collapseWhitespace: true, removeComments: true }))
      .pipe(plugins.ngHtml2js({
          moduleName: "rsApp",
          prefix: "static/",
          declareModule: false
      }));

pipes.builtStylesProd = () =>
    gulp.src(paths.styles)
      .pipe(sourcemaps.init())
        .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(pipes.minifiedFileName())
      .pipe(gulp.dest(paths.distProdStatic));

pipes.builtIndexProd = () => {
    const vendorScripts = pipes.builtVendorScriptsProd();
    const appScripts = pipes.builtAppScriptsProd();
    const appStyles = pipes.builtStylesProd();

    return pipes.validatedIndex()
      .pipe(gulp.dest(paths.distProd)) // write first to get relative path for inject
      .pipe(plugins.inject(series(vendorScripts, appScripts), { relative: true }))
      .pipe(plugins.inject(appStyles, { relative: true }))
      .pipe(plugins.htmlmin({ collapseWhitespace: true, removeComments: true }))
      .pipe(gulp.dest(paths.distProd));
};

pipes.builtAppProd = () =>
    pipes.builtIndexProd();

// ******* TASKS ******* //

// removes all dev files
gulp.task("clean-dev", () =>
    del(paths.distDev).then((paths) => {
        console.log("Deleted files and folders in:\n", paths.join("\n"));
    }));

// removes all compiled production files
gulp.task("clean-prod", () =>
    del(paths.distProd).then((paths) => {
        console.log("Deleted files and folders in:\n", paths.join("\n"));
    }));

// checks html source files for syntax errors
gulp.task("validate-partials", pipes.validatedPartials);

// checks index.html for syntax errors
gulp.task("validate-index", pipes.validatedIndex);

// moves html source files into the dev environment
gulp.task("build-partials-dev", pipes.builtPartialsDev);

// converts partials to javascript using html2js
gulp.task("convert-partials-to-js", pipes.scriptedPartials);

// runs eslint on the dev server scripts
gulp.task("validate-devserver-scripts", pipes.validatedDevServerScripts);

// runs eslint on the app scripts
gulp.task("validate-app-scripts", pipes.validatedAppScripts);

// moves app images into dev environment
gulp.task("build-images-dev", pipes.builtDevImgs);

// moves app images into prod environment
gulp.task("build-images-prod", pipes.builtProdImgs);

// moves app scripts into the dev environment
gulp.task("build-app-scripts-dev", pipes.builtAppScriptsDev);

// concatenates, uglifies, and moves app scripts and partials into the prod environment
gulp.task("build-app-scripts-prod", pipes.builtAppScriptsProd);

// compiles app sass and moves to the dev environment
gulp.task("build-styles-dev", pipes.builtStylesDev);

// compiles and minifies app sass to css and moves to the prod environment
gulp.task("build-styles-prod", pipes.builtStylesProd);

// moves vendor scripts into the dev environment
gulp.task("build-vendor-scripts-dev", pipes.builtVendorScriptsDev);

// concatenates, uglifies, and moves vendor scripts into the prod environment
gulp.task("build-vendor-scripts-prod", pipes.builtVendorScriptsProd);

// validates and injects sources into index.html and moves it to the dev environment
gulp.task("build-index-dev", pipes.builtIndexDev);

// validates and injects sources into index.html, minifies and moves it to the dev environment
gulp.task("build-index-prod", pipes.builtIndexProd);

// builds a complete dev environment
gulp.task("build-app-dev", pipes.builtAppDev);

// builds a complete prod environment
gulp.task("build-app-prod", pipes.builtAppProd);

// cleans and builds a complete dev environment
gulp.task("clean-build-app-dev", ["clean-dev"], pipes.builtAppDev);

// cleans and builds a complete prod environment
gulp.task("clean-build-app-prod", ["clean-prod"], pipes.builtAppProd);

// clean, build, and watch live changes to the dev environment
gulp.task("watch-dev", ["clean-build-app-dev", "validate-devserver-scripts", "build-images-dev"], () => {
    // start nodemon to auto-reload the dev server
    plugins.nodemon({ script: "backend/server.js", ext: "js", watch: ["backend/"], env: { NODE_ENV: "development" } })
      .on("change", ["validate-devserver-scripts"])
      .on("restart", () => {
          console.log("[nodemon] restarted dev server.");
      });

    // start live-reload server
    plugins.livereload.listen({ start: true });

    // watch index
    gulp.watch(paths.index, () =>
        pipes.builtIndexDev()
          .pipe(plugins.livereload())
    );

    // watch app scripts
    gulp.watch(paths.scripts, () =>
        pipes.builtAppScriptsDev()
          .pipe(plugins.livereload())
    );

    // watch html partials
    gulp.watch(paths.partials, () =>
        pipes.builtPartialsDev()
          .pipe(plugins.livereload())
    );

    // watch styles
    gulp.watch(paths.styles, () =>
        pipes.builtStylesDev()
          .pipe(plugins.livereload())
    );
});

// clean, build, and watch live changes to the prod environment
gulp.task("watch-prod", ["clean-build-app-prod", "validate-devserver-scripts", "build-images-prod"], () => {
    // start nodemon to auto-reload the dev server
    plugins.nodemon({ script: "backend/server.js", ext: "js", watch: ["backend/"], env: { NODE_ENV: "production" } })
      .on("change", ["validate-devserver-scripts"])
      .on("restart", () => {
          console.log("[nodemon] restarted prod server");
      });

    // start live-reload server
    plugins.livereload.listen({ start: true });

    // watch index
    gulp.watch(paths.index, () =>
        pipes.builtIndexProd()
          .pipe(plugins.livereload())
    );

    // watch app scripts
    gulp.watch(paths.scripts, () =>
        pipes.builtAppScriptsProd()
          .pipe(plugins.livereload())
    );

    // watch html partials
    gulp.watch(paths.partials, () =>
        pipes.builtAppScriptsProd()
          .pipe(plugins.livereload())
    );

    // watch styles
    gulp.watch(paths.styles, () =>
        pipes.builtStylesProd()
          .pipe(plugins.livereload())
    );
});

// default task builds for prod
gulp.task("default", ["watch-dev"]);
