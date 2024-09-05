/**
 * Component shown when page does not exist.
 * 
 * @param {{ path: string }} props
 * @returns {React.JSX.Element}
 */
export default function Error404(props) {
    return <>
        <h1>404 Not Found</h1>
        <p>{props.path}</p>
    </>;
}
