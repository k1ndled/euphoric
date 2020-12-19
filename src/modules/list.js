module.exports = {
    name: "list",
    description: "Lists tokens",
    usage: "<favorites/privates>",
    execute(args) {
        switch (args[0]) {
            case "privates":
                (async () => {
                    const res = await ta.privates();
                    log("\n");
                    res.forEach(acc => {
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
                    res.forEach(acc => {
                        log(primary(`[+] ${acc.token} (${acc.username})`));
                    });
                })();
                break;
            default:
                return log(
                    chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
                );
        }
    },
};
