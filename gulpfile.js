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
    fonts: ["public/runescape_uf.ttf"],
    distDev: "./dev",
    distDevStatic: "./dev/static",
    distProd: "./prod",
    distProdStatic: "./prod/static",
    distScriptsProd: "./prod/static/scripts",
    scriptsDevServer: "backend/**/*.js"
};

const resolvePath = (path) => {
    let appendPath = path;
    let index = appendPath.match(/public/i).index;

    appendPath = appendPath.split("").splice(index + 6).join("");
    index = appendPath.lastIndexOf("/");
    appendPath = appendPath.split("").splice(0, index).join("");
    return appendPath;
};

const pipes = {};

// validators

pipes.validatedAppScripts = scripts =>
    gulp.src(scripts)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format());

pipes.validatedPartials = partials =>
    gulp.src(partials)
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

pipes.builtDevImgs = () =>
    gulp.src(paths.images)
      .pipe(image())
      .pipe(gulp.dest("dev/static/img"));

pipes.builtDevFonts = () =>
    gulp.src(paths.fonts)
      .pipe(gulp.dest("dev/static"));

pipes.orderedVendorScripts = () =>
    plugins.order(["angular.js", "angular-route", "angular-mock", "angular-smart-table"]);

pipes.builtVendorScriptsDev = () =>
    gulp.src(bowerFiles())
      .pipe(gulp.dest("dev/static/bower_components"));

pipes.builtAppScriptsDev = (scripts, appendPath) => {
    const path = appendPath || "";
    return pipes.validatedAppScripts(scripts)
      .pipe(babel({ presets: ["es2015"] }))
      .pipe(gulp.dest(paths.distDevStatic + path));
};

pipes.builtPartialsDev = (partials, appendPath) => {
    const path = appendPath || "";
    return pipes.validatedPartials(partials)
      .pipe(gulp.dest(paths.distDevStatic + path));
};

pipes.builtStylesDev = () =>
    gulp.src(paths.styles)
      .pipe(gulp.dest(paths.distDevStatic));

pipes.builtIndexDev = () => {
    const orderedVendorScripts = pipes.builtVendorScriptsDev()
      .pipe(pipes.orderedVendorScripts());
    const orderedAppScripts = pipes.builtAppScriptsDev(paths.scripts)
      .pipe(angularFilesort());
    const appStyles = pipes.builtStylesDev();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDev)) // write first to get relative path for inject
        .pipe(plugins.inject(series(orderedVendorScripts, orderedAppScripts), { relative: true }))
        .pipe(plugins.inject(appStyles, { relative: true }))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtAppDev = () =>
    es.merge(pipes.builtIndexDev(), pipes.builtPartialsDev(paths.partials));

// ***** PROD ONLYS ***** //

pipes.minifiedFileName = () =>
    plugins.rename((path) => {
        path.extname = `.min${path.extname}`;
    });

pipes.builtProdImgs = () =>
    gulp.src(paths.images)
      .pipe(image())
      .pipe(gulp.dest("prod/static/img"));

pipes.builtProdFonts = () => {
    gulp.src(paths.fonts)
      .pipe(gulp.dest("prod/static"));
};

pipes.scriptedPartials = () =>
    pipes.validatedPartials(paths.partials)
      .pipe(plugins.htmlhint.failReporter())
      .pipe(plugins.htmlhint({ collapseWhitespace: true, removeComments: true }))
      .pipe(plugins.ngHtml2js({
          moduleName: "rsApp",
          prefix: "static/",
          declareModule: false
      }));

pipes.builtVendorScriptsProd = () =>
    gulp.src(bowerFiles("**/*.js"))
      .pipe(pipes.orderedVendorScripts())
      .pipe(plugins.concat("vendor.min.js"))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(paths.distScriptsProd));

pipes.builtAppScriptsProd = () => {
    const scriptedPartials = pipes.scriptedPartials();
    const validatedAppScripts = pipes.validatedAppScripts(paths.scripts);

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
    del(paths.distDev).then((path) => {
        console.log("Deleted files and folders in:\n", path.join("\n"));
    }));

// removes all compiled production files
gulp.task("clean-prod", () =>
    del(paths.distProd).then((path) => {
        console.log("Deleted files and folders in:\n", path.join("\n"));
    }));

// runs eslint on the dev server scripts
gulp.task("validate-devserver-scripts", pipes.validatedDevServerScripts);

// builds a complete prod environment
gulp.task("build-app-prod", ["build-prod-fonts"], pipes.builtAppProd);

gulp.task("build-prod-fonts", ["build-prod-images"], pipes.builtProdFonts);

gulp.task("build-prod-images", ["clean-prod"], pipes.builtProdImgs);

// cleans and builds a complete dev environment
gulp.task("build-app-dev", ["build-dev-fonts"], pipes.builtAppDev);

gulp.task("build-dev-fonts", ["build-dev-images"], pipes.builtDevFonts);

gulp.task("build-dev-images", ["clean-dev"], pipes.builtDevImgs);

// clean, build, and watch live changes to the dev environment
gulp.task("watch-dev", ["build-app-dev", "validate-devserver-scripts"], () => {
    // start nodemon to auto-reload the dev server
    plugins.nodemon({
        script: "backend/server.js",
        ext: "js",
        watch: ["backend/"],
        env: {
            NODE_ENV: "development",
            PORT: 3000,
            IP: "127.0.0.1",
            DATABASE_URL: "postgres://localhost:5432/osrs_hub"
        }
    })
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
    gulp.watch(paths.scripts, (e) => {
        const appendPath = resolvePath(e.path);
        return pipes.builtAppScriptsDev(e.path, appendPath)
          .pipe(plugins.livereload());
    });

    // watch html partials
    gulp.watch(paths.partials, (e) => {
        const appendPath = resolvePath(e.path);
        return pipes.builtPartialsDev(e.path, appendPath)
          .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, () =>
        pipes.builtStylesDev()
          .pipe(plugins.livereload())
    );
});

gulp.task("dev", ["watch-dev"]);

gulp.task("prod", ["build-app-prod", "validate-devserver-scripts"], () => console.log("Production app built!"));

// default task builds for dev
gulp.task("default", ["watch-dev"]);
