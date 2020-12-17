module.exports = {
    name: "info",
    description: "Shows information about an alt",
    usage: "<alt-token / username>",
    execute(args) {
        let ign;
        if (args[0].includes("@")) {
            (async () => {
                //ign = utils.getUsername("cnppi-6oy0w@alt.com");
                return log(primary(`// TODO: Convert token to IGN`));
            })();
        } else if (args[0]) {
            ign = args[0];
        }
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
                log(primary(`uuid:: ${player.uuid}`));
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
                log(primary(`broke ${bw.beds.broken.toLocaleString()} beds`));

                // duels stats
                log(primary(`duels coins:: ${duels.coins.toLocaleString()}`));
                log(primary(`duels kills:: ${duels.kills.toLocaleString()}`));
                log(primary(`duels wins:: ${duels.wins.toLocaleString()}`));

                // ADD SKYBLOCK COINS
                // REFERENCE => https://cdn.chatter.host/skbylockAPI.png
                // CONVERT IGN TO UUID IN ORDER TO USE
                // API LINK => https://api.hypixel.net/Skyblock/profiles?key=<API-KEY>&uuid=<UUID>
            })
            .catch(e => {
                console.log(e);
            });
    },
};
