const { fstat } = require("fs");

module.exports = {
    name: "generate",
    description: "Generates an alt",
    usage: "[hypixel=true / info=true]",
    execute(args) {
        let settings = {};
        args.forEach(arg => {
            if (arg == "hypixel=true") {
                settings.hypixel = true;
            }
            if (arg == "info=true") {
                settings.info = true;
            }
        });
        (async () => {
            const res = await ta.generate();
            const skin = await ta.getSkin(res.token);
            if (conf.get("copyToken") == true) {
                clipboardy.writeSync(res.token);
            }
            if (settings.info == true) {
                log(
                    primary(
                        `\naccount generated (token copied to clipboard)\nign: ${res.username}\nskin: ${skin}`
                    )
                );
                if (res.info) {
                    for (const item in res.info) {
                        log(chalk.hex("#9bb6e0")(`[!] ${item}`));
                    }
                }
                addAccount(res.token, res.username);
                log(
                    primary(
                        conf.get("copyToken")
                            ? "(token copied to clipboard)"
                            : ""
                    )
                );
            } else {
                log(primary(`\naccount generated \nign: ${res.username}`));
                log(
                    primary(
                        conf.get("copyToken")
                            ? "(token copied to clipboard)"
                            : ""
                    )
                );
                addAccount(res.token, res.username);
            }
        })();

        function addAccount(token, ign) {
            log("// TODO: Account history");
        }
    },
};
