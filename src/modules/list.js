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
				const pms = require("pretty-ms");
				async function getDate(token){
					let info = await ta.altInfo(token);
					return new Promise((resolve, reject) => {
						resolve({
							expiration: info.expires
						});
					});
				}
				if(conf.get('history-type') == "large"){
					result.items.forEach((item) => {
						getDate(item.token).then(date =>{
							var parsedDate = new Date(date.expiration);
							var milliseconds = parsedDate.getTime();
							let expiry = pms(milliseconds - Date.now());
							expiry = expiry.split("d");
							log(primary(`[+] ${item.token} - (${item.ign}) ${`expires in ${expiry[0]} days`} [generated ${pms(Date.now() - item.timeGenerated, {compact: true})} ago]`));
						})
					});
				}
				else if(!conf.get(`history-type`)){
					result.items.forEach((item) => {
						getDate(item.token).then(date =>{
							var parsedDate = new Date(date.expiration);
							var milliseconds = parsedDate.getTime();
							let expiry = pms(milliseconds - Date.now());
							expiry = expiry.split("d");
							if(expiry[0].includes("-")){
								log(primary(`[+] ${item.token} - expired`));
							} else{
								log(primary(`[+] ${item.token} - valid`));
							}
						})
					});
				} else if(conf.get(`history-type`) == "compact"){
					result.items.forEach((item) => {
						getDate(item.token).then(date =>{
							var parsedDate = new Date(date.expiration);
							var milliseconds = parsedDate.getTime();
							let expiry = pms(milliseconds - Date.now());
							expiry = expiry.split("d");
							if(expiry[0].includes("-")){
								log(primary(`[+] ${item.token} - expired`));
							} else{
								log(primary(`[+] ${item.token} - valid`));
							}
						})
					});
				}
				if(result.current && result.last){
					log(primary(`viewing page ${result.current}/${result.last} (${arr.length} accounts were found)`));
				} else{
					log(primary(`viewing page 1/1 (${arr.length} accounts were found)`));
				}
				if(!conf.get(`history-type`)){
					log(primary("(you can show more in the history by using 'config')"))
				}
                break;
            default:
                return log(
                    chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
                );
        }
    },
};
