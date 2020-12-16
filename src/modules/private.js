module.exports = {
    name: "private",
    description: "Privates an alt",
    usage: "<alt-token>",
    execute(args) {
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
