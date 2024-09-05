import { BLOG_PATH } from "../lib";
import { handleAnchorClick } from "../router";

const MDIT_OPTIONS = {
    html: true,
    langPrefix: "lang-",
};

export default function Markdown(props) {
    const ref = React.useRef(null);
    const src = props.source.replace(/\]\(denote:/, `](/${BLOG_PATH}/`);

    React.useEffect(() => {
        /** @type {?HTMLElement} */
        const el = ref.current;

        if (el) {
            /** @type {?HTMLAnchorElement[]} */
            const as = el.querySelectorAll("a");
            as?.forEach(a => {
                const href = a.getAttribute("href");
                if (href && href.startsWith("/")) {
                    a.addEventListener("click", handleAnchorClick);
                } else if (href) {
                    a.setAttribute("target", "_blank");
                    a.setAttribute("rel", "noopener noreferrer");
                }
            });
        }
        
        return () => {
            if (el) {
                /** @type {?HTMLAnchorElement[]} */
                const as = el.querySelectorAll("a");
                as?.forEach(a => {
                    a.removeEventListener("click", handleAnchorClick);
                });
            }
        };
    }, [src, handleAnchorClick]);

    const html = markdownit(MDIT_OPTIONS).render(src);

    return <article ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
