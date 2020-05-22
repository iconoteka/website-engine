#!/usr/bin/env node

const spawn = require('cross-spawn');
const path = require('path');

const args = process.argv.slice(2);

const oringinalCwd = process.cwd();
process.env.ICONOTEKA_ORIGINAL_CWD = oringinalCwd;
const cwd = path.resolve(path.join(__dirname, '..'));
process.chdir(cwd);

const cracoScriptPath = require.resolve('@craco/craco/bin/craco.js');

const processArgs = [
    cracoScriptPath,
    args
];

const child = spawn.sync("node", processArgs, { stdio: "inherit" });

if (child.signal) {
    if (child.signal === "SIGKILL") {
        console.log(`
            The build failed because the process exited too early.
            This probably means the system ran out of memory or someone called
            \`kill -9\` on the process.
        `);
    } else if (child.signal === "SIGTERM") {
        console.log(`
            The build failed because the process exited too early.
            Someone might have called  \`kill\` or \`killall\`, or the system could
            be shutting down.
        `);
    }

    process.exit(1);
}

process.exit(child.status);