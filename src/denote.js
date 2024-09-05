import { BLOG_DIRECTORY, BLOG_FILE, REPO_PATH } from "./lib.js";

/** 
 * Punctionation that is removed from file names.
 * We consider those characters illegal for our purposes.
 */
const DENOTE_EXCLUDED_PUNCTUATION_REGEXP = /[\]\[{}!@#$%^&*()=+'"?,.\|;:~`‘’“”\/]*/g;

/**
 * Remove punctuation from STR.
 * 
 * Concretely, replace with an empty string anything that matches
 * the DENOTE_EXCLUDED_PUNCTUATION_REGEXP.
 * 
 * @param {string} str input string
 * @returns {string} processed input
 */
function denoteSlugNoPunct(str) {
    return str.replaceAll(DENOTE_EXCLUDED_PUNCTUATION_REGEXP, "");
}

/**
 * Replace spaces and underscores with hyphens in STR.
 * 
 * Also replace multiple hyphens with a single one and remove any
 * leading and trailing hyphen.
 * 
 * @param {string} str input string
 * @returns {string} processed input
 */
function denoteSlugHyphenate(str) {
    return str.replaceAll(/^-\\|-$/g, "")
              .replaceAll(/-\\{2,\\}/g, "-")
              .replaceAll(/_\\|\s+/g, "-");
}

/**
 * Make STR an appropriate slug for title.
 * 
 * @param {string} str input string
 * @returns {string} processed input
 */
function denoteSluggifyTitle(str) {
    return denoteSlugHyphenate(denoteSlugNoPunct(str))
           .toLowerCase();
}

/**
 * Sluggify STR while joining separate words.
 * 
 * @param {string} str input string
 * @returns {string} processed input
 */
function denoteSluggifyKeyword(str) {
    return denoteSlugHyphenate(denoteSlugNoPunct(str))
           .replaceAll("-", "")
           .toLowerCase();
}

/**
 * Sluggify KEYWORDS, which is a list of strings.
 * 
 * @param {string[]} keywords list of keywords
 * @returns {string} processed input
 */
function denoteSluggifyKeywords(keywords) {
    return keywords.map(kw => denoteSluggifyKeyword(kw)).join("_");
}

/******************************************************************************/

/**
 * The file metadata.
 * 
 * @typedef Metadata
 * 
 * @prop {string} title
 * @prop {string} date
 * @prop {string[]} tags
 * @prop {string} identifier 
 */

/**
 * Parse frontmatter from markdown.
 * 
 * @param {string} str input markdown
 * @returns {[Metadata, string]} frontmatter + clean markdown
 */
export function denoteParseFrontmatter(str) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/m;
    const match = str.match(frontmatterRegex);

    if (!match) { // No frontmatter found
        const empty = {
            title: "",
            date: "",
            tags: [],
            identifier: "",
        };
        return [empty, str];
    }

    /** @type {Metadata} */
    const metadata = {};
    const [frontmatter, values] = match;

    for (const line of values.split(/\r?\n/)) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const [key, value] = trimmedLine.split(/:\s*(.+)/);
        if (!key || !value) continue;

        const trimmedKey = key.trim();
        const trimmedValue = value.trim();

        // Check if the value is an array.
        if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
            const arrayValue = JSON.parse(trimmedValue);
            metadata[trimmedKey] = arrayValue;
        } else {
            // Remove quotes.
            metadata[trimmedKey] = trimmedValue.replace(/(^"|"$)/g, ''); 
        }
    }

    return [metadata, str.replace(frontmatter, "")];
}

/**
 * Generate file name from frontmatter metadata.
 * 
 * @param {Metadata} frontmatter 
 * @returns {string} full filename
 */
export function denoteFilenameFromFrontmatter(frontmatter) {
    const title = denoteSluggifyTitle(frontmatter.title);
    const tags = denoteSluggifyKeywords(frontmatter.tags);
    return `${frontmatter.identifier}--${title}__${tags}.md`;
}

/******************************************************************************/

/**
 * Fetch available posts.
 * 
 * @returns {Promise<Metadata[]>} list of available posts
 */
export async function fetchPosts() {
    const response = await fetch(`/${BLOG_FILE}`);
    if (!response.ok) {
        const message = `Could not fetch posts: ${response.status} ${response.statusText}`;
        console.error(message);
        throw new Error(message);
    }
    return response.json();
}

/**
 * Fetch post content.
 * 
 * @param {string} identifier post identifier
 * @returns {Promise<string>} post contents
 */
export async function fetchPost(identifier) {
    const posts = await fetchPosts();
    const meta = posts.find(post => post["identifier"] === identifier);
    if (meta === undefined) {
        const message = `Could not find post with id: ${identifier}`;
        console.error(message);
        throw new Error(message);
    }

    const filename = denoteFilenameFromFrontmatter(meta);
    const res = await fetch(`${REPO_PATH}/${filename}`);
    if (!res.ok) {
        const message = `Could not fetch post with id: ${identifier}: ${res.status} ${res.statusText}`;
        console.error(message);
        throw new Error(message);
    }
    
    return res.text();
}
