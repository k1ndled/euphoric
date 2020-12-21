module.exports = {
    name: "private",
    description: "Private / unprivate an alt",
    usage: "<alt-token>",
    aliases: ["hide"],
    execute(args) {
        if (!args[0]) {
            return log(
                chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
            );
        }
        (async () => {
			const res = await ta.private(args[0]);
            if (res.success == true) {
                utils.getAccount(args[0]).then((acc) => {
                    if (acc.success == true) {
                        log(primary(`successfully privated ${acc.username}`));
                    }
                });
            }
        })();
    },
};
