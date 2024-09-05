import { fetchPosts } from "../denote.js";
import { BLOG_PATH, setPageTitle } from "../lib.js";
import { handleAnchorClick } from "../router.js";

/**
 * List of blogposts.
 * 
 * @param {{tag: ?string}} props
 * @returns {React.JSX.Element}
 */
export default function BlogList(props) {
    setPageTitle("Blog posts");

    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function getPosts() {
            try {
                const data = await fetchPosts();
                setPosts(data);
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false);
            }
        }

        getPosts();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    let title = "All Blog posts";
    if (props.tag) {
        title = `Posts tagged ${props.tag}`;
    }

    const postsByYear = {};
    /** @type {import("../denote.js").Metadata[]} */
    const sortedPosts = posts.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime());
    sortedPosts.forEach(post => {
        const year = new Date(post.date).getFullYear().toString();
        if (!postsByYear[year]) postsByYear[year] = [];
        if (props.tag && !post.tags.includes(props.tag)) return;
        postsByYear[year].push(post);
    });

    const allTags = []
    sortedPosts.forEach(post => post.tags.forEach(tag => {
        if (allTags.includes(tag)) return;
        allTags.push((
            <a href={`/${BLOG_PATH}/tags/${tag}`} onClick={handleAnchorClick}>
                {` #${tag}`}
            </a>
        ));
    }));

    const postByYear = (year) => postsByYear[year].map(post => {
        const date = new Date(post.date);
        const month = (date.getMonth()+1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return <li key={date.getTime()}>
            <span className="date">{month}-{day}</span>
            <a href={`/${BLOG_PATH}/${post.identifier}`} onClick={handleAnchorClick}>
                {post.title}
            </a>
        </li>;
    });

    return <>
        <header>
            <h1>{title}</h1>
            <p>Filter by tag: {allTags}</p>
        </header>
        {Object.keys(postsByYear).reverse().map(year => (
            <section key={year}>
                <h1 title={`Posts from ${year}`}>{year}</h1>
                <ol className="post-list">{postByYear(year)}</ol>
            </section>
        ))}
    </>;
}
