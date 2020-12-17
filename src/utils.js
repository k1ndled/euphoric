const prettyMilliseconds = require("pretty-ms");

module.exports = {
    getUsername(token) {
        log(
            "// TODO: Login with Mineflayer to get the uncensored username and get Hypixel stats."
        );
        const mineflayer = require("mineflayer");
        var username = token;
        var options = {
            host: "hub.mcs.gg",
            port: "25565",
            username: username,
            password: "f",
            version: "1.8.9",
        };
    },
    debugMsg(msg) {
        log(chalk.hex("#ebd742")("[DEBUG] - ") + msg);
    },
};
