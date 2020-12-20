module.exports = {
    name: "reload",
    description: "Reloads a command",
    usage: "<command>",
    aliases: ["rl"],
    execute(args) {
        if (!args[0]) {
            return log(
                chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
            );
        }
        var commandName = args[0].toLowerCase();
        if (!args[1]) {
            var command;
            if (commandsCollection.get(commandName)) {
                command = commandsCollection.get(commandName);
            }
            if (!command)
                return log(
                    `There is no command with the name \`${commandName}\!`
                );
            delete require.cache[require.resolve(`./${command.name}.js`)];
            try {
                const newCommand = require(`./${command.name}.js`);
                commandsCollection.set(newCommand.name, newCommand);
                log(`Reloaded ${newCommand.name}`);
            } catch (error) {
                console.error(error);
                log(
                    `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
                );
            }
            return;
        }
    },
};
