module.exports = {
    name: "private",
    description: "Private / unprivate an alt",
    usage: "<alt-token>",
    execute(args) {
        if (!args[0]) {
            return log(
                chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
            );
        }
        (async () => {
            const res = await ta.private(args[0]);
            const alt = await ta.altInfo(args[0]);
            if (res.success == true) {
                log(
                    primary(
                        `Successfully privated ${alt.username}. Now no one can use it >:)`
                    )
                );
            }
        })();
    },
};
