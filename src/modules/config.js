const discordRPC = require("../discordRPC");

module.exports = {
    name: "config",
    description: "Set configuration values",
    usage: "[key]",
    aliases: ["settings", "configuration"],
    execute(args) {
        switch (args[0]) {
            case "hypixel-key":
            case "hypixelKey":
                if (args[1]) {
                    conf.set("hypixel-api-key", args[1]);
                    conf.save();
                    log(primary("Successfully set your Hypixel API key."));
                }
                break;
            case "thealtening-key":
            case "ta-key":
            case "taKey":
                if (args[1]) {
                    conf.set("ta-api-key", args[1]);
                    conf.save();
                    log(primary("Successfully set your TheAltening API key."));
                }
                break;
            case "copy-token":
            case "copyToken":
                if (conf.get("copyToken") == true) {
                    conf.set("copyToken", false);
                    conf.save();
                    log(primary("Disabled automatically copying tokens"));
                    break;
                } else if (conf.get("copyToken") == false) {
                    conf.set("copyToken", true);
                    conf.save();
                    log(primary("Enabled automatically copying tokens"));
                    break;
                }
                break;
            case "discord-rpc":
            case "rpc":
                if (conf.get("discord-rpc") == true) {
                    conf.set("discord-rpc", false);
                    conf.save();
                    log(primary("Disabled discord-rpc (reboot)"));
                    break;
                } else if (conf.get("discord-rpc") == false) {
                    conf.set("discord-rpc", true);
                    conf.save();
                    log(primary("Enabled discord-rpc"));
                    discordRPC.start();
                    break;
                } else if (!conf.get("discord-rpc")) {
                    conf.set("discord-rpc", true);
                    conf.save();
                    log(primary("Enabled discord-rpc"));
                    discordRPC.start();
                    break;
                }
                break;
            default:
                log(
                    primary(
                        "Avalible configuration options: hypixel-key, thealtening-key, copy-token, discord-rpc"
                    )
                );
                break;
        }
    },
};
