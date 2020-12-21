/*/
Euphoric :: Main.js

This is the main file for Euphoric, it handles the setup, sets variables, and handles all of the commands.

/*/

// imports
global.path = require("path");
global.fs = require("fs");
global.os = require("os");
global.readline = require("readline");
global.fetch = require("node-fetch");
global.conf = require("nconf");
global.taClient = require("thealtening-js");
global.Hypixel = require("hypixel-api-reborn");
global.chalk = require("chalk");
global.clipboardy = require("clipboardy");

// files
global.package = require("../package.json");
global.utils = require("./utils.js");

// aliases
global.log = console.log;
global.primary = chalk.hex("#63e060");
global.debugMsg = utils.debugMsg;

// setup
global.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

// welcome message
console.clear();
log(chalk.hex("#63e060")(`Welcome ${os.hostname()}, to Euphoric CLI`));
process.stdout.write(
    String.fromCharCode(27) +
        "]0;" +
        `Euphoric CLI | v${package.version}` +
        String.fromCharCode(7)
);

// check / set config

function start() {
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
    if (
        fs.existsSync(path.join(__dirname, "..", "config", "accountCache.json"))
    ) {
        global.accCache = require(path.join(
            __dirname,
            "..",
            "config",
            "accountCache.json"
        ));
    }
}

if (!fs.existsSync("./config/config.json")) {
    ask("setup");
} else {
    start();
}

// ask for setup questions

function ask(type) {
    if (type == "setup") {
        rl.question(
            "It appears you have not used this application before. Would you like to start the setup? (y/n) => ",
            (r) => {
                if (r.toLowerCase() == "y") {
                    fs.mkdirSync(`./config`);
                    conf.file({
                        file: path.join(
                            __dirname,
                            "../",
                            "config",
                            "config.json"
                        ),
                    });
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
        rl.question("Enter a TheAltening API Key => ", (r) => {
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
        rl.question("Enter a Hypixel API Key => ", (r) => {
            conf.set("hypixel-api-key", r);
            // auto-set copyToken
            conf.set("copyToken", true);
            conf.save();
            console.clear();
            log(primary("Successfully set your Hypixel API Key"));
            start();
        });
    }
}

// now we can run the DiscordRPC

require("./discordRPC").start();

// setup command handler

global.commandsCollection = new Map();
global.aliasesCollection = new Map();

let counter = {};
counter.commands = 0;
counter.aliases = 0;

const commands = fs
    .readdirSync(path.join(__dirname, "modules"))
    .filter((r) => r.endsWith(".js"));
for (const command of commands) {
    const x = require(path.join(__dirname, "modules", command));
    commandsCollection.set(x.name, x);
    counter.commands = counter.commands + 1;
    if (x.aliases) {
        x.aliases.forEach((alias) => {
            aliasesCollection.set(alias, x);
            counter.aliases = counter.aliases + 1;
        });
    }
}

// this handles all the command execution

function execute() {
    rl.question("=> ", (r) => {
        const args = r.split(" ");
        const cmd = args.shift();
        if (!cmd) {
            return execute();
        }
        if (
            !commandsCollection.get(cmd.toLowerCase()) &&
            !aliasesCollection.get(cmd.toLowerCase())
        ) {
            log("unknown command :: type 'help' for help");
            return execute();
        }
        if (aliasesCollection.get(cmd.toLowerCase())) {
            try {
                aliasesCollection.get(cmd).execute(args);
                return execute();
            } catch (e) {
                return execute();
            }
        } else if (commandsCollection.get(cmd.toLowerCase())) {
            commandsCollection.get(cmd.toLowerCase()).execute(args);
        }
        return execute();
    });
}
