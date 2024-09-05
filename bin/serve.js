import cmd from "./cmd.js";

cmd("http-server", [
    "-p", "6969",
    "-a", "127.0.0.1",
    "--silent",
    "-c-1",
    "-d", "false"
])
