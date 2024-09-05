import App from "./components/App.jsx";

/**
 * Object where `path` in `location.pathname` corresponds to `cmp`
 * react component.
 * 
 * @typedef {{ path: string, cmp: React.FunctionComponent<any> }} Route
 */

/**
 * Render main App component inside `window.root`.
 */
export function renderContent() {
    let path = window.location.pathname;
    window.root.render(React.createElement(App, {path}));
}

/**
 * Replace default anchor behaviour on click.
 * 
 * @param {MouseEvent|React.MouseEvent} event 
 */
export function handleAnchorClick(event) {
    // Skip the default to allow SPA behaviour.
    event.preventDefault();

    /** Link's href attribute. @type {?string} */
    let href = event.target.getAttribute("href");

    if (href) {
        window.history.pushState({}, "", href);
        renderContent();
    }
}
