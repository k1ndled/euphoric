module.exports = {
    name: "list",
    description: "Lists tokens",
    usage: "<favorites/privates/history>",
    execute(args) {
        switch (args[0]) {
            case "privates":
                (async () => {
                    const res = await ta.privates();
                    log("\n");
                    res.forEach((acc) => {
                        log(
                            primary(
                                `[+] ${acc.token} (${acc.username}) | ${
                                    acc.valid ? "valid" : "invalid"
                                }`
                            )
                        );
                    });
                })();
                break;
            case "favorites":
                (async () => {
                    const res = await ta.favorites();
                    log("\n");
                    res.forEach((acc) => {
                        log(primary(`[+] ${acc.token} (${acc.username})`));
                    });
                })();
                break;
            case "generated":
            case "history":
                let accounts = 0;
                for (let acc of Object.keys(accCache.accounts)) {
                    var account = accCache.accounts[acc];
                    accounts++;
                    log(primary(`${account.token} [${account.ign}]`));
                }
                log(primary(`(${accounts} accounts)`));
                break;
            default:
                return log(
                    chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
                );
        }
    },
};
