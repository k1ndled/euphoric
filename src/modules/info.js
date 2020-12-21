const utils = require("../utils");

module.exports = {
    name: "info",
    description: "Shows information about an alt",
    usage: "<alt-token / username> [hypixel=true]",
    execute(args) {
        if (!args[0]) {
            return log(
                chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
            );
        }
        let ign;
        // uuid
        let uuid;
        utils.ignToUUID(ign).then((id) => {
            uuid = id.id;
        });
        let settings = {};
        // if there's a token in the args, get ign from token
        if (args[0]) {
            if (args[0].includes("@")) {
                utils.getAccount(args[0]).then((acc) => {
                    if (acc.success == true) {
						ign = acc.username;
                    } else{
						log(acc.error);
					}
                });
            } else {
                ign = args[0];
            }
        } else {
            return log(
                chalk.hex("#ed0707")(`usage: ${this.name} ${this.usage}`)
            );
        }
        // settings init
        args.forEach((arg) => {
            if (arg == "hypixel=true") {
                settings.hypixel = true;
            }
            if (arg == "all=true") {
                settings.all = true;
            }
        });
        // if the hypixel setting is set, show only Hypixel info.
        if (settings.hypixel == true) {
            printHypixelStats();
            return;
        }
        // if the all setting is set, show all the info (Hypixel and general)
        if (settings.all == true) {
            printHypixelStats();
            printGeneral();
            return;
        }
        // if it's not one of the two settings, print general info.
        printGeneral(true);

        // functions below

        function printGeneral(singular) {
			log(primary(`\ngeneral info | ${ign}\n`));
			const { lookupUUID } = require("namemc");
            utils.ignToUUID(ign).then((id) => {
                log(primary(`uuid:: ${id.id}`));
                let nameChanges = 0;
                let names = [];
                fetch(`https://api.mojang.com/user/profiles/${id.id}/names`)
                    .then((res) => res.json())
                    .then((json) => {
                        json.forEach((acc) => {
                            nameChanges++;
                            names.push(acc.name);
                        });
                        log(primary(`name changes:: ${nameChanges}`));
                        fetch(`http://s.optifine.net/capes/${ign}.png`)
                            .then((res) => {
                                return res.text();
                            })
                            .then((body) => {
                                if (body && body.includes("Not found")) {
                                    log(primary("optifine cape:: no"));
                                } else {
                                    log(primary("optifine cape:: yes"));
								}
								(async () => {
									const user = await lookupUUID(id.id);
									let skinCount = 0;
									if(user.imageUrls.skins){
										user.imageUrls.skins.forEach(skin => {
											skinCount++;
										});
										log(primary(`skins:: ${skinCount}`));
									}
								})();
                                utils.checkMineconCape(id.id).then((r) => {
                                    if (r.success == true) {
                                        log(primary("minecon cape:: yes"));
                                    } else if (r.error == "No Mincon cape") {
                                        log(primary("minecon cape:: no"));
                                    } else {
                                        log(
                                            chalk.hex("#ed0707")(
                                                `there was an error fetching the minecon cape api\n${r.error}`
                                            )
                                        );
                                    }
                                    if (singular == true) {
                                        log(
                                            primary(
                                                `(you can also get hypixel stats for ${ign} by adding "hypixel=true" or "all=true" to your command)`
                                            )
                                        );
                                    }
                                });
                            });
                    });
            });
        }

        function printHypixelStats() {
			if(!ign){
				if (args[0].includes("@")) {
					utils.getAccount(args[0]).then((acc) => {
						if (acc.success == true) {
							ign = acc.username;
							hypixel
							.getPlayer(ign)
							.then((player) => {
								let swWinstreak;
								let bwWinstreak;
								let sw = player.stats.skywars;
								let bw = player.stats.bedwars;
								let duels = player.stats.duels;

								// general hypixel stats

								log(
									primary(
										`hypixel info:: \n[${player.rank}] ${player.nickname}`
									)
								);
								log(primary(`network level:: ${player.level}`));
								log(
									primary(`is online:: ${player.isOnline ? "yes" : "no"}`)
								);
								log(primary(`last online:: ${player.lastLogout}`));
								log("\n");

								// minigame stats

								log(primary(`:: game stats ::`));

								// skywars stats
								if (sw) {
									log(primary(`sw level:: ${sw.levelFormatted}`));
									log(primary(`sw coins:: ${sw.coins.toLocaleString()}`));
									if (sw.winstreak == 0) {
										swWinstreak = "none";
									} else {
										swWinstreak = sw.winstreak;
									}
									log(primary(`sw winstreak:: ${swWinstreak}`));
									log(
										primary(`sw kils:: ${sw.kills.toLocaleString()}\n`)
									);
								}

								// bedwars stats

								if (bw) {
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
									log(
										primary(
											`bw finals:: ${bw.finalKills.toLocaleString()}`
										)
									);
									log(
										primary(
											`broke ${bw.beds.broken.toLocaleString()} beds\n`
										)
									);
								}
								// duels stats
								if (duels) {
									log(
										primary(
											`duels coins:: ${duels.coins.toLocaleString()}`
										)
									);
									log(
										primary(
											`duels kills:: ${duels.kills.toLocaleString()}`
										)
									);
									log(
										primary(
											`duels wins:: ${duels.wins.toLocaleString()}\n`
										)
									);
								}

								fetch(
									`https://api.hypixel.net/Skyblock/profiles?key=${conf.get(
										"hypixel-api-key"
									)}&uuid=${player.uuid}`
								)
									.then((res) => res.json())
									.then((json) => {
										if (json.success == true) {
											if (json.profiles) {
												log(primary(`skyblock coins::`));
												json.profiles.forEach((profile) => {
													if (profile.banking) {
														log(
															primary(
																`[${
																	profile.cute_name
																}] ${profile.banking.balance.toLocaleString()} coins in the bank, with ${profile.members[
																	player.uuid
																].coin_purse.toLocaleString()} coins in their purse`
															)
														);
													}
												});
											}
										} else {
											log(
												chalk.hex("#ed0707")(
													`there was an error fetching skyblock coins`
												)
											);
											return;
										}
									})
									.catch((error) => {
										log(chalk.hex("#ed0707")(`error:\n${error}`));
									});
							})
							.catch((e) => {
								log(e);
							});
						} else{
							log(acc.error);
						}
					});
				}
			}
        }
    },
};
