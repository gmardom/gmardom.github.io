import cmd from "./cmd.js";

cmd("http-server", [
    "-p", "6969",
    "-a", "127.0.0.1",
    "--silent",
    "-c-1",
    "-d", "false"
]);

cmd("esbuild", [
    "--watch",
    "--bundle",
    "src/index.js",
    "--outfile=static/page.bundle.js",
]);

cmd("sass", [
    "--no-source-map",
    "--watch",
    "src/style.scss",
    "static/style.css",
]);

cmd("cp", [
    "node_modules/react/umd/react.development.js",
    "static/react.min.js",
]);
cmd("cp", [
    "node_modules/react-dom/umd/react-dom.development.js",
    "static/react-dom.min.js",
]);
cmd("cp", [
    "node_modules/markdown-it/dist/markdown-it.js",
    "static/markdown-it.min.js",
]);
