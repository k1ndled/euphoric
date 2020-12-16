module.exports = {
    name: "favorite",
    description: "Favorite an alt",
    usage: "<alt-token>",
    execute(args) {
        (async () => {
            const res = await ta.favorite(args[0]);
            const alt = await ta.altInfo(args[0]);
            if (res.success == true) {
                log(primary(`Successfully favorited ${alt.username}`));
            }
        })();
    },
};
