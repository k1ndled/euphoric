module.exports = {
    name: "list",
    description: "Lists stuff",
    usage: "<favorites/privates>",
    execute(args) {
        async () => {
            const res = ta.privates();
            log(res);
        };
    },
};
