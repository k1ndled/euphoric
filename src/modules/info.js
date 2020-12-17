const utils = require("../utils");

module.exports = {
    name: "info",
    description: "Shows information about an alt",
    usage: "<alt-token / username>",
    execute(args) {
        let ign;
        let uuid;
        if (!args[0]) {
            return log(
                chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
            );
        }
        if (args[0].includes("@")) {
            (async () => {
                //ign = utils.getUsername("cnppi-6oy0w@alt.com");
                return log(primary(`// TODO: Convert token to IGN`));
            })();
        } else if (args[0]) {
            ign = args[0];
        }
        utils.ignToUUID(ign).then(id => {
            uuid = id.id;
        });
        hypixel
            .getPlayer(ign)
            .then(player => {
                let nameChanges = 0;
                player.history.forEach(change => {
                    nameChanges++;
                });
                let swWinstreak;
                let bwWinstreak;
                let sw = player.stats.skywars;
                let bw = player.stats.bedwars;
                let duels = player.stats.duels;

                // general hypixel stats

                log(primary(`\n[${player.rank}] ${player.nickname}`));
                log(primary(`name changes:: ${nameChanges}`));
                log(primary(`network level:: ${player.level}`));
                log(primary(`is online:: ${player.isOnline ? "yes" : "no"}`));
                log(primary(`last online:: ${player.lastLogout}`));
                log("\n");

                // minigame stats

                log(primary(`:: game stats ::`));

                // skywars stats

                log(primary(`sw level:: ${sw.levelFormatted}`));
                log(primary(`sw coins:: ${sw.coins.toLocaleString()}`));
                if (sw.winstreak == 0) {
                    swWinstreak = "none";
                } else {
                    swWinstreak = sw.winstreak;
                }
                log(primary(`sw winstreak:: ${swWinstreak}`));
                log(primary(`sw kils:: ${sw.kills.toLocaleString()}\n`));

                // bedwars stats

                log(primary(`bw level:: ${bw.level}`));
                log(primary(`bw coins:: ${bw.coins.toLocaleString()}`));
                if (bw.winstreak == 0) {
                    bwWinstreak = "none";
                } else {
                    bwWinstreak = bw.winstreak;
                }
                log(primary(`bw wins:: ${bw.wins}`));
                log(primary(`bw winstreak:: ${bwWinstreak}`));
                log(primary(`bw kils:: ${bw.kills.toLocaleString()}`));
                log(primary(`bw finals:: ${bw.finalKills.toLocaleString()}`));
                log(primary(`broke ${bw.beds.broken.toLocaleString()} beds\n`));

                // duels stats
                log(primary(`duels coins:: ${duels.coins.toLocaleString()}`));
                log(primary(`duels kills:: ${duels.kills.toLocaleString()}`));
                log(primary(`duels wins:: ${duels.wins.toLocaleString()}\n`));

                fetch(
                    `https://api.hypixel.net/Skyblock/profiles?key=${conf.get(
                        "hypixel-api-key"
                    )}&uuid=${uuid}`
                )
                    .then(res => res.json())
                    .then(json => {
                        if (json.success == true) {
                            log(primary(`skyblock coins::`));
                            json.profiles.forEach(profile => {
                                if (profile.banking) {
                                    log(
                                        primary(
                                            `[${
                                                profile.cute_name
                                            }] ${profile.banking.balance.toLocaleString()} coins in the bank, with ${profile.members[
                                                uuid
                                            ].coin_purse.toLocaleString()} coins in their purse`
                                        )
                                    );
                                }
                            });
                        } else {
                            log(
                                chalk.hex("#ed0707")(
                                    `there was an error fetching skyblock coins`
                                )
                            );
                            return;
                        }
                    })
                    .catch(error => {
                        log(chalk.hex("#ed0707")(``));
                    });
            })
            .catch(e => {
                console.log(e);
            });
    },
};
