module.exports = {
    name: "list",
    description: "Lists tokens",
    usage: "<favorites/privates/history>",
    execute(args) {
        switch (args[0]) {
            case "privates":
                (async () => {
                    const res = await ta.privates();
                    log("\n");
                    res.forEach((acc) => {
                        log(
                            primary(
                                `[+] ${acc.token} (${acc.username}) | ${
                                    acc.valid ? "valid" : "invalid"
                                }`
                            )
                        );
                    });
                })();
                break;
            case "favorites":
                (async () => {
                    const res = await ta.favorites();
                    log("\n");
                    res.forEach((acc) => {
                        log(primary(`[+] ${acc.token} (${acc.username})`));
                    });
                })();
                break;
            case "generated":
            case "history":
				if( typeof accCache === 'undefined' || accCache === null ){
					return log(primary("no account cache :c\ngo generate some accounts!"));
				}
                const paginate = require("paginatejson");
                let page;
                if (!args[1]) {
                    page = 1;
                } else {
                    page = args[1];
                }
                if (args[1] < 1) {
                    log(primary(`${args[1]} is an invalid page.`));
                    return;
                }
                // Credits: https://stackoverflow.com/questions/14528385/how-to-convert-json-object-to-javascript-array
                function json2array(json) {
                    var result = [];
                    var keys = Object.keys(json);
                    keys.forEach(function (key) {
                        result.push(json[key]);
                    });
                    return result;
                }
                let arr = json2array(accCache.accounts);
                let result = paginate.paginate(
                    arr,
                    page,
                    conf.get("max-page-length")
                        ? conf.get("max-page-length")
                        : 5
                );
                if (args[1] > result.last) {
                    log(primary(`${args[1]} is an invalid page.`));
                    return;
                }
                result.items.forEach((item) => {
                    log(primary(`[+] ${item.token} (${item.ign})`));
                });
                log(primary(`viewing page ${result.current}/${result.last}`));
                break;
            default:
                return log(
                    chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
                );
        }
    },
};
