module.exports = {
    name: "random",
    description: "Randomly chooses a token",
    usage: "<favorite/private>",
    aliases: ["rnd"],
    execute(args) {
        if (!args[0]) {
            return log(
                chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
            );
        }
        switch (args[0]) {
            case "favorite":
            case "favourite":
                (async () => {
                    const res = await ta.favorites();
                    var acc = res[Math.floor(Math.random() * res.length)];
                    if (conf.get("copyToken") == true) {
                        clipboardy.writeSync(acc.token);
                        utils.getAccount(acc.token).then((account) => {
                            if (account.success == true) {
                                log(
                                    primary(
                                        `randomly chose ${account.username} (copied token to clipboard)`
                                    )
                                );
                            }
                        });
                    } else {
                        utils.getAccount(acc.token).then((account) => {
                            if (account.success == true) {
                                log(
                                    primary(
                                        `randomly chose ${acc.token} (${account.username})`
                                    )
                                );
                            }
                        });
                    }
                })();
                break;
            case "private":
                (async () => {
                    const res = await ta.privates();
                    var acc = res[Math.floor(Math.random() * res.length)];
                    if (conf.get("copyToken") == true) {
                        utils.getAccount(acc.token).then((account) => {
                            if (account.success == true) {
                                log(
                                    primary(
                                        `randomly chose ${account.username} [${
                                            acc.valid
                                                ? "valid account"
                                                : "invalid account"
                                        }] (copied token to clipboard)`
                                    )
                                );
                            }
                        });
                        clipboardy.writeSync(acc.token);
                    } else {
                        utils.getAccount(acc.token).then((account) => {
                            if (account.success == true) {
                                log(
                                    primary(
                                        `randomly chose ${account.username} [${
                                            acc.valid
                                                ? "valid account"
                                                : "invalid account"
                                        }]`
                                    )
                                );
                            }
                        });
                    }
                })();
                break;
        }
    },
};
