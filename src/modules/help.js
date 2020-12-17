module.exports = {
    name: "help",
    description: "Shows the help",
    execute(args) {
        log(
            primary(
                "Hey! This is a command line interface for TheAltening API, made by kindled. Here is all the commands you can use so far."
            )
        );
        commandsCollection.forEach(r => {
            log(
                ` - ${r.name}${r.usage ? " " + r.usage : ""} - ${r.description}`
            );
        });
    },
};
