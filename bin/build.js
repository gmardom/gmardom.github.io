import cmd from "./cmd.js";

process.env.NODE_ENV = "production";

cmd("esbuild", [
    "--minify",
    "--bundle",
    "--outfile=static/page.bundle.js",
    "src/index.js",
]);

cmd("sass", [
    "--style=compressed",
    "--no-source-map",
    "src/style.scss",
    "static/style.css",
])

cmd("cp", [
    "node_modules/react/umd/react.production.min.js",
    "static/react.min.js",
]);
cmd("cp", [
    "node_modules/react-dom/umd/react-dom.production.min.js",
    "static/react-dom.min.js",
]);
cmd("cp", [
    "node_modules/markdown-it/dist/markdown-it.min.js",
    "static/markdown-it.min.js",
]);
