module.exports = {
    name: "generate",
    description: "Generates an alt",
    usage: "[hypixel=true / info=true]",
    aliases: ["gen"],
    execute(args) {
        let started = Date.now();
        log(primary("generating account..."));
        let settings = {};
        args.forEach((arg) => {
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
                        "(api limit reached :: you will no longer get unique accounts until the timer resets @ 7 PM EST)"
                    )
                );
            }
            if (settings.info == true) {
                utils.getAccount(res.token).then((acc) => {
                    if (acc.success == true) {
                        log(
                            primary(
                                `\naccount generated in ${
                                    Date.now() - started
                                }ms\nign: ${acc.username}\nskin: ${skin}`
                            )
                        );
                        addAccount(res.token, res.username);
                        log(
                            primary(
                                conf.get("copyToken")
                                    ? "(token copied to clipboard)"
                                    : ""
                            )
                        );
                        if (res.info) {
                            for (const item in res.info) {
                                log(chalk.hex("#9bb6e0")(`[!] ${item}`));
                            }
                        }
                    }
                });
            } else {
                utils.getAccount(res.token).then((acc) => {
                    if (acc.success == true) {
                        log(
                            primary(
                                `\naccount generated in ${
                                    Date.now() - started
                                }ms \nign: ${acc.username}`
                            )
                        );
                        log(
                            primary(
                                conf.get("copyToken")
                                    ? "(token copied to clipboard)"
                                    : `\ntoken: ${res.token}`
                            )
                        );
                        utils.addAccount(acc.username, res.token);
                    }
                });
            }
        })();
    },
};
