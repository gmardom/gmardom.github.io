export const BLOG_PATH = "blog";
export const BLOG_DIRECTORY = "content/blog";
export const BLOG_FILE = "content/blog.json";

export const USER = "gmardom";
export const GITH_URL = `https://github.com/${USER}`;
export const REPO_URL = `${GITH_URL}/${USER}.github.io`;
export const SITE_URL = `https://${USER}.github.io`;

export function setPageTitle(title) {
    document.title = `${title} - ${USER}`;
}
