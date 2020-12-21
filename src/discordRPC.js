/*/
Euphoric :: DiscordRPC.js

This file handles the Discord RPC, checks if it's running, starts it, with the ability to stop it aswell.

/*/

const exec = require("child_process").exec;
let isRPCStarted;
let loop;
let timeStarted;
const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = "";
    switch (platform) {
        case "win32":
            cmd = `tasklist`;
            break;
        case "darwin":
            cmd = `ps -ax | grep ${query}`;
            break;
        case "linux":
            cmd = `ps -A`;
            break;
        default:
            break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
};

module.exports = {
    updatePresence(text) {
        if (conf.get("discord-rpc") == false) {
            return;
        }
        if (isRPCStarted == true) {
            rpcClient.updatePresence({
                state: text,
                largeImageKey: "ici1kki",
                largeImageText: "The best TheAltening CLI",
                smallImageKey: "pfp",
                smallImageText: "Developed by kindled",
                startTimestamp: timeStarted,
                instance: true,
            });
        }
    },
    start() {
        isRunning("Discord.exe", status => {
            if (status == true) {
                global.rpcClient = require("discord-rich-presence")(
                    "788799390374166589"
                );
                rpcClient.on("connected", () => {
                    isRPCStarted = true;
                    timeStarted = Date.now();
                    this.updatePresence("Just launched");
                    this.startLoop();
                });
            }
        });
    },
    startLoop() {
        loop = setInterval(() => {
            let resps = [
                "Generating accounts :o",
                "Evading bans >:)",
                "Hacking on noobs",
                "op account generator",
                "made by kindled",
                "gives you massive amounts of euphoria",
            ];
            var resp = resps[Math.floor(Math.random() * resps.length)];
            this.updatePresence(resp);
        }, 120000);
    },
    stopLoop() {
        clearInterval(loop);
    },
};
