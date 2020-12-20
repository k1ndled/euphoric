module.exports = {
    name: "clear",
    description: "Clears the console",
    aliases: ["cls"],
    execute(args) {
        console.clear();
        log(primary("console cleared."));
    },
};
