import { BLOG_PATH } from "./lib.js";
import { handleAnchorClick, renderContent } from "./router.js";

import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import Error404 from "./components/Error404";
import Home     from "./pages/Home";

// Grab the root container.
const container = document.getElementById("content");
const root = ReactDOM.createRoot(container);

/** @type {import("./router").Route[]} */
const routes = [];
routes.push({ path: `/${BLOG_PATH}/tags/[tag]`,   cmp: BlogList });
routes.push({ path: `/${BLOG_PATH}/[identifier]`, cmp: BlogPost });
routes.push({ path: `/${BLOG_PATH}`,              cmp: BlogList });
routes.push({ path: `/404`,                       cmp: Error404 });
routes.push({ path: `/`,                          cmp: Home     });

// Make links in static html have correct event handler.
const as = document.querySelectorAll("a:not([target=\"_blank\"])");
as.forEach(a => a.addEventListener("click", handleAnchorClick));

// Setup the window object.
window.root = root;
window.routes = routes;
window.addEventListener("popstate", renderContent);
window.addEventListener("load", renderContent);
