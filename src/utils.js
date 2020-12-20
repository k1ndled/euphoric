module.exports = {
    getAccount(token) {
        return new Promise((resolve, reject) => {
            const ygg = require("yggdrasil")({
                host: "http://authserver.thealtening.com",
            });
            ygg.auth(
                {
                    user: token,
                    pass: "anything",
                    requestUser: true,
                },
                function (err, data) {
                    if (err) {
                        console.error(`${err}`);
                        resolve({
                            success: false,
                            error: err,
                        });
                    } else if (data) {
                        resolve({
                            success: true,
                            accessToken: data.accessToken,
                            username: data.selectedProfile.name,
                            uuid: data.selectedProfile.id,
                        });
                    }
                }
            );
        });
    },
    debugMsg(msg) {
        log(chalk.hex("#ebd742")("[DEBUG] - ") + msg);
    },
    addAccount(ign, token) {
        log(primary(`saved ${ign} to the account history`));
        // set file to acc cache
        conf.file({
            file: path.join(__dirname, "..", "config", "accountCache.json"),
        });
        // set values
        conf.set(`accounts:${token}:token`, token);
        conf.set(`accounts:${token}:ign`, ign);
        // save the values
        conf.save();
        // set the file back to the config.
        conf.file({
            file: path.join(__dirname, "..", "config", "config.json"),
        });
        delete global.accCache;
        let cache = fs.readFileSync(
            path.join(__dirname, "..", "config", "accountCache.json")
        );
        global.accCache = JSON.parse(cache.toString());
    },
    async ignToUUID(ign) {
        const res = await fetch(
            `https://api.mojang.com/users/profiles/minecraft/${ign}`
        );
        return res.json();
    },
    async checkMineconCape(uuid) {
        const res = await fetch(`https://crafatar.com/capes/${uuid}`);
        if (res.status == 404) {
            return { success: false, error: "No Mincon cape" };
        } else if (res.status == 304 || res.status == 200) {
            return {
                success: true,
                cape: `https://crafatar.com/capes/${uuid}`,
            };
        } else {
            return res;
        }
    },
};
