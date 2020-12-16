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
            if (res.limit == true) {
                log(
                    chalk.hex("#fcc221")(
                        "(api limit reached :: you will no longer get unique accounts until the timer is reset)"
                    )
                );
            }
            if (settings.info == true) {
                log(
                    primary(
                        `\naccount generated\nign: ${res.username}\nskin: ${skin}`
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
                debugMsg("this was called");
                addAccount(res.token, res.username);
            }
        })();
        function addAccount(token, ign) {
            return log("// TODO: add to account history");
        }
    },
};
