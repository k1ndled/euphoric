module.exports = {
    name: "help",
    description: "Shows the help",
    execute(args) {
        log(primary(`${package.name} (v${package.version}) :: help`));
        commandsCollection.forEach(r => {
            let aliases;
            if (r.aliases) {
                aliases = r.aliases.join(", ");
            }
            log(
                ` - ${r.name}${r.usage ? " " + r.usage : ""} - ${
                    r.description
                } ${aliases ? `(${aliases})` : ""}`
            );
        });
    },
};
