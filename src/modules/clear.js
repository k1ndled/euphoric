module.exports = {
    name: "clear",
    description: "Clears the console",
    execute(args) {
        console.clear();
        log(primary("console cleared."));
    },
};
