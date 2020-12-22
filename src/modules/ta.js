module.exports = {
    name: "ta",
    description: "Shows information about your TheAltening account",
    aliases: ["thealtening"],
    execute(args) {
        (async () => {
            const pms = require("pretty-ms");
            const res = await ta.license();
            var parsedDate = new Date(res.expires);
            var milliseconds = parsedDate.getTime();
            let expiry = pms(milliseconds - Date.now());

            log(
                primary(
                    `username: ${res.username} | has license: ${
                        res.hasLicense ? `yes | plan: ${res.licenseType}` : "no"
                    } | expires in:  ${expiry}`
                )
            );
        })();
    },
};
