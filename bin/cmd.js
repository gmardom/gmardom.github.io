import { spawn } from "child_process";

export default function cmd(program, args = []) {
    const spawnOptions = { "shell": true };
    
    console.log("CMD:", program, args.flat().join(" "), spawnOptions);
    
    const p = spawn(program, args.flat(), spawnOptions);
    
    p.stdout.on("data", (data) => process.stdout.write(data));
    p.stderr.on("data", (data) => process.stderr.write(data));
    p.on("close", (code) => {
        if (code !== 0) {
            console.error(program, args, "exited with", code);
        }
    });
    
    return p;
}
