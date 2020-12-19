module.exports = {
    name: "random",
    description: "Randomly chooses a token",
    usage: "<favorite/private>",
    execute(args) {
        switch (args[0]) {
            case "favorite":
                (async () => {
                    const res = await ta.favorites();
                    var acc = res[Math.floor(Math.random() * res.length)];
                    if (conf.get("copyToken") == true) {
                        clipboardy.writeSync(acc.token);
                        log(
                            primary(
                                `randomly chose ${acc.username} (copied token to clipboard)`
                            )
                        );
                    } else {
                        log(
                            primary(
                                `randomly chose ${acc.token} (${acc.username})`
                            )
                        );
                    }
                })();
                break;
            case "private":
                (async () => {
                    const res = await ta.privates();
                    var acc = res[Math.floor(Math.random() * res.length)];
                    if (conf.get("copyToken") == true) {
                        clipboardy.writeSync(acc.token);
                        log(
                            primary(
                                `randomly chose ${acc.username} [${
                                    acc.valid
                                        ? "valid account"
                                        : "invalid account"
                                }] (copied token to clipboard)`
                            )
                        );
                    } else {
                        log(
                            primary(
                                `randomly chose ${acc.token} [${
                                    acc.valid
                                        ? "valid account"
                                        : "invalid account"
                                }] (${acc.username})`
                            )
                        );
                    }
                })();
                break;
        }
    },
};
