import fs from "fs";
import MarkdownIt from "markdown-it";
import { denoteParseFrontmatter } from "../src/denote.js";
import { BLOG_DIRECTORY, BLOG_FILE, BLOG_PATH, SITE_URL } from "../src/lib.js";

const XML_HEADER = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

function getBlogPosts() {
    return fs.readdirSync(BLOG_DIRECTORY);
}

function updatePostsFile() {
    let posts = [];
    
    const files = getBlogPosts().map(f => `${BLOG_DIRECTORY}/${f}`);
    files.forEach(file => {
        const data = fs.readFileSync(file, "utf-8");
        const frontmatter = denoteParseFrontmatter(data)[0];
        if (frontmatter) posts.push(frontmatter);
    });
    
    fs.writeFileSync(BLOG_FILE, JSON.stringify(posts)+"\n");
}

function updateSitemapXML() {
    const dest = "sitemap.xml";

    const staticDate = new Date().toISOString();
    const staticRoutes = [
        { path: `/`,             date: staticDate },
        { path: `/${BLOG_PATH}`, date: staticDate },
    ];

    const files = getBlogPosts();
    const blogRoutes = files.map(file => {
        const content = fs.readFileSync(`${BLOG_DIRECTORY}/${file}`);
        const [metadata, _] = denoteParseFrontmatter(content.toString());
        return {
            path: `/${BLOG_PATH}/${metadata.identifier}`,
            date: new Date(metadata.date).toISOString(),
        };
    });

    const routes = [staticRoutes, blogRoutes].flat();
    const urls = routes.map(route => 
        `<url><loc>${SITE_URL}${route.path}</loc><lastmod>${route.date}</lastmod></url>`
    );

    const sitemap = `${XML_HEADER}<urlset>${urls.join("")}</urlset>\n`;
    fs.writeFileSync(dest, sitemap);
}

function updateRssFeed() {
    const dest = "feed.xml";

    const title = "<title>gMarDom's Blog posts</title>";
    const link = `<link>${SITE_URL}</link>`;
    const lang = "<language>en-us</language>";
    const date = `<lastBuildDate>${new Date().toISOString()}</lastBuildDate>`;
    const alink = `<atom:link href="${SITE_URL}/${dest}" rel="self" type="application/rss+xml" />`;
    const header = `${title}${link}${lang}${date}${alink}`;

    const files = getBlogPosts();
    const items = files.map(file => {
        const content = fs.readFileSync(`${BLOG_DIRECTORY}/${file}`);
        const [metadata, markdown] = denoteParseFrontmatter(content.toString());
        const url = `${SITE_URL}/${BLOG_PATH}/${metadata.identifier}`;

        const html = MarkdownIt()
            .render(markdown)
            .replace(/\n\</g, "<")
            .replace(/\</g, "\&lt\;")
            .replace(/\>/g, "\&gt\;")
            .replace(/\n/g, "");

        const title = `<title>${metadata.title}</title>`;
        const link = `<link>${url}</link>`;
        const guid = `<guid>${url}</guid>`;
        const date = `<pubDate>${new Date(metadata.date).toISOString()}</pubDate>`;
        const desc = `<description>${html}</description>`;

        return `<item>${title}${link}${guid}${date}${desc}</item>`;
    }).join("");

    const rss = `${XML_HEADER}<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>${header}${items}</channel></rss>\n`;
    fs.writeFileSync(dest, rss);
}

(() => {
    updatePostsFile();
    updateSitemapXML();
    updateRssFeed();
})();
