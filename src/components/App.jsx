import Error404 from "./Error404.jsx";

/**
 * Component containing logic to properly route to diffrent paths.
 * 
 * @param {{ path: string }} props
 * @returns {React.JSX.Element}
 */
export default function App(props) {
    /** Route's component. @type {React.FunctionComponent<any>} */
    let component = null;
    /** Route's properties if any. @type {Object.<string, string>} */
    let properties = {};

    /** @type {import("../router").Route[]} */
    const routes = window.routes;
    for (let i = 0; i < routes.length; ++i) {
        const route = routes[i];
        
        let slugs = [];
        let regex = `^${route.path}$`;
        for (const [slug, slugName] of route.path.matchAll(/\[(\w+)\]/ig)) {
            regex = regex.replace(slug, "([\\w\\d-_=]+)");
            slugs.push(slugName);
        }

        const matches = props.path.match(regex);
        if (!matches) continue;

        component = route.cmp;
        if (matches.length > 1) {
            for (let j = 1; j < matches.length; ++j) {
                properties[slugs[j-1]] = matches[j];
            }
        }
        break;
    }

    if (!component) {
        component = Error404;
        properties["path"] = props.path;
    }

    return React.createElement(component, properties);
}

// TODO: Better route matching.
