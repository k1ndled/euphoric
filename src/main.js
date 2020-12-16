// imports
global.path = require("path");
global.fs = require("fs");
global.os = require("os");
global.readline = require("readline");
global.conf = require("nconf");
global.taClient = require("thealtening-js");
global.Hypixel = require("hypixel-api-reborn");
global.chalk = require("chalk");
global.clipboardy = require("clipboardy");
global.package = require("../package.json");

// aliases
global.log = console.log;
global.primary = chalk.hex("#63e060");

// setup
global.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

// welcome message
console.clear();
log(chalk.hex("#63e060")(`Welcome ${os.hostname()}, to TheAltening CLI`));
process.stdout.write(
    String.fromCharCode(27) +
        "]0;" +
        `TheAltening CLI | v${package.version}` +
        String.fromCharCode(7)
);

// check / set config

if (!fs.existsSync("./config/config.json")) {
    ask("setup");
} else {
    conf.file({ file: path.join(__dirname, "../", "config", "config.json") }); // Set configuration file in Nconf
    if (conf.get("ta-api-key")) {
        global.ta = new taClient(conf.get("ta-api-key"));
        (async () => {
            const res = await ta.license();
            log(
                primary(
                    `Logged in as ${res.username} | Plan: ${res.licenseType}`
                )
            );
            execute();
        })();
    }
    if (conf.get("hypixel-api-key")) {
        global.hypixel = new Hypixel.Client(conf.get("hypixel-api-key"));
    }
}

// ask for setup questions

function ask(type) {
    if (type == "setup") {
        rl.question(
            "It appears you have not used this application before. Would you like to start the setup? (y/n) => ",
            r => {
                if (r.toLowerCase() == "y") {
                    ask("ta-api-key");
                    return;
                } else if (r.toLowerCase() == "n") {
                    process.exit(1);
                } else {
                    log(chalk.hex("#fc3200")(`Invalid option, closing.`));
                    process.exit(1);
                }
            }
        );
    }
    if (type == "ta-api-key") {
        rl.question("Enter a TheAltening API Key => ", r => {
            if (r.includes("api-")) {
                conf.set("ta-api-key", r);
                conf.save();
                console.clear();
                log(primary("Successfully set your TheAltening API Key"));
                return ask("hypixel-api-key");
            } else {
                log(chalk.hex("#fc3200")(`Invalid option, closing.`));
                process.exit(1);
            }
        });
    }
    if (type == "hypixel-api-key") {
        rl.question("Enter a Hypixel API Key => ", r => {
            conf.set("hypixel-api-key", r);
            conf.save();
            console.clear();
            log(primary("Successfully set your Hypixel API Key"));
            return execute();
        });
    }
}

// setup command handler

let commandsCollection = new global.Map();
const commands = fs
    .readdirSync(path.join(__dirname, "modules"))
    .filter(r => r.endsWith(".js"));
for (const command of commands) {
    const x = require(path.join(__dirname, "modules", command));
    commandsCollection.set(x.name, x);
}

// this handles all the command execution

function execute() {
    rl.question("=> ", r => {
        const args = r.split(" ");
        const cmd = args.shift();
        if (!cmd) {
            return execute();
        }
        if (!commandsCollection.get(cmd.toLowerCase())) {
            log("unknown command :: type 'help' for help");
            return execute();
        }
        if (cmd.toLowerCase() == "help") {
            commandsCollection
                .get(cmd.toLowerCase())
                .execute(commandsCollection, args);
            return execute();
        }
        commandsCollection.get(cmd.toLowerCase()).execute(args);
        return execute();
    });
}
