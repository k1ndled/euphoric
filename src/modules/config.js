const discordRPC = require("../discordRPC");

module.exports = {
    name: "config",
    description: "Set configuration values",
    usage: "[key]",
    aliases: ["settings", "configuration"],
    execute(args) {
        switch (args[0]) {
			// Hypixel key configuration
            case "hypixel-key":
            case "hypixelKey":
                if (args[1]) {
                    conf.set("hypixel-api-key", args[1]);
                    conf.save();
                    log(primary("Successfully set your Hypixel API key."));
                }
				break;
			// TheAltening key configuration
            case "thealtening-key":
            case "ta-key":
            case "taKey":
                if (args[1]) {
                    conf.set("ta-api-key", args[1]);
                    conf.save();
                    log(primary("Successfully set your TheAltening API key."));
                }
				break;
			// If Euphoric should automatically copy tokens upon generation
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
			// Max amount of alts allowed on a history page
            case "maxpagelength":
            case "max-page-length":
            case "maxpages":
                function isNumeric(str) {
                    if (typeof str != "string") return false; // we only process strings!
                    return (
                        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                        !isNaN(parseFloat(str))
                    ); // ...and ensure strings of whitespace fail
                }
                if (isNumeric(args[1])) {
                    if (args[1] < 1) {
                        return log("Invalid number");
                    }
                    conf.set("max-page-length", args[1]);
                    log(primary(`Set the max page length to ${args[1]}`));
                    break;
                } else {
                    log(primary(`${args[1]} is an invalid number`));
                    break;
				}
			// Toggle Discord Rich Presence
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
			case 'history-type':
			case 'history':
				if(args[1].toLowerCase() == "compact" || args[1].toLowerCase() == "small"){
					conf.set("history-type", "compact");
					conf.save();
					log(primary(`no longer showing more info in the account history`));
					break;
				}
				if(args[1].toLowerCase() == "large" || args[1].toLowerCase() == "big"){
					conf.set("history-type", "large");
					conf.save();
					log(primary(`now showing more info in the account history`));
					break;
				}
				else{
					log(primary(`${args[1]} is an invalid history type. use compact or large`));
					break;
				}
			// If the configuration value doesn't equal one of those, show this log message.
            default:
                log(
                    primary(
                        "Avalible configuration options: hypixel-key, thealtening-key, copy-token, discord-rpc, max-page-length, history-type"
                    )
                );
                break;
        }
    },
};
