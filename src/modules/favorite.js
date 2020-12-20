module.exports = {
    name: "favorite",
    description: "Favorite / unfavorite an alt",
    usage: "<alt-token>",
    aliases: ["fav", "favourite"],
    execute(args) {
        if (!args[0]) {
            return log(
                chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
            );
        }
        (async () => {
            const res = await ta.favorite(args[0]);
            if (res.success == true) {
                utils.getAccount(res.token).then((acc) => {
                    if (acc.success == true) {
                        log(primary(`successfully favorited ${acc.username}`));
                    }
                });
            }
        })();
    },
};
