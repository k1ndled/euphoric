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

    // MAKE THIS WORK

    async ignToUUID(ign) {
        const res = await fetch(
            `https://api.mojang.com/users/profiles/minecraft/${ign}`
        );
        return res.json();
    },

    async checkMineconCape(uuid) {
        const res = await fetch(`https://crafatar.com/capes/${uuid}`);
        if (res.status == 404) {
            return { success: "false", error: "No Mincon cape" };
        } else if (res.status == 304) {
            return {
                success: "true",
                cape: `https://crafatar.com/capes/${uuid}`,
            };
        }
    },
};
