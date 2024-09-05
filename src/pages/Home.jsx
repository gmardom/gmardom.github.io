import { GITH_URL, REPO_URL, setPageTitle } from "../lib.js";
import { handleAnchorClick } from "../router.js";

export default function Home() {
    setPageTitle("About");

    return <>
        <h1>👋 Hi, I'm Dominik!</h1>
        <p>
            I'm a self-taught programmer from Poland with a strong focus on simplicity and maintainability in my code. I particularly enjoy using the C programming language, as it allows me to write efficient and powerful applications. In addition to coding, I love to tinker with Linux, exploring its capabilities and customizing my environment to enhance my productivity.
        </p>
        <p>
            In my free time, I dive into new technologies and work on personal projects, always seeking to learn and improve my skills. For more details about my workspace and tools, check out <a href="/blog/20240902T132029" onClick={handleAnchorClick}>my setup</a>.
        </p>
        <h2>🚀 My projects</h2>
        <p>
            Feel free to check out my <a href={GITH_URL} target="_blank" rel="noopener noreferrer">GitHub</a> to see what I'm currently working on! You'll find a variety of projects that showcase my skills and interests, along with my ongoing journey in programming.
        </p>
        <h2>🌍 This website</h2>
        <p>
            If you are curious about this website, it is built using <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a>, the way it should be used. After enough frustration, I created this website using only <a href="https://react.dev/reference/react" target="_blank" rel="noopener noreferrer">the documentation</a>, <a href="https://stackoverflow.com/" target="_blank" rel="noopener noreferrer">Stack Overflow</a>, and the limited experience I had with webdev. You can check out the source code <a href={REPO_URL} target="_blank" rel="noopener noreferrer">here</a>.
        </p>
    </>;
}
