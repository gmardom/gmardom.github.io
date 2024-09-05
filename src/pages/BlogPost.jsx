import Markdown from "../components/Markdown.jsx";
import { handleAnchorClick } from "../router.js";
import { BLOG_DIRECTORY, BLOG_PATH, REPO_URL, setPageTitle } from "../lib.js";
import { denoteFilenameFromFrontmatter, denoteParseFrontmatter, fetchPost } from "../denote.js";

export default function BlogPost({identifier}) {
    const [markdown, setMarkdown] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function getMarkdown() {
            try {
                const md = await fetchPost(identifier);
                setMarkdown(md);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        getMarkdown();
    }, [identifier]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const [metadata, newMarkdown] = denoteParseFrontmatter(markdown);
    const filename = denoteFilenameFromFrontmatter(metadata);

    const title = metadata.title;
    setPageTitle(title);
            
    const date = new Date(metadata.date);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
            
    return <>
        <header className="post-info">
            <h1>{title}</h1>
            <div className="details">
                <time dateTime={date.toISOString()}>Published {dateString}</time>
                {metadata?.tags.map((tag, index) => 
                    <a key={index} href={`/${BLOG_PATH}/tags/${tag}`} onClick={handleAnchorClick}>#{tag}</a>
                )}
                <a href={`${REPO_URL}/edit/main/${BLOG_DIRECTORY}/${filename}`} title="Propose change" target="_blank" rel="noopener noreferrer">📝</a>
            </div>
        </header>
        <Markdown className="blog-post" source={newMarkdown} />
    </>;
}
