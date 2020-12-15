module.exports = {
	name: "help",
	description: "Shows the help",
	execute(cmds, args) {
		log(
			"Hey! This is a command line interface for TheAltening API. Here is all the commands you can use."
		);
		cmds.forEach(r => {
			log(` - ${r.name}${r.usage ? " " + r.usage : ""} - ${r.description}`);
		});
	}
};
