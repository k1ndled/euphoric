module.exports = {
    name: "ta",
    description: "Shows information about your TheAltening account",
    aliases: ["thealtening"],
    execute(args) {
        (async () => {
            const res = await ta.license();
            log(
                primary(
                    `username: ${res.username} | has license: ${
                        res.hasLicense ? `yes | plan: ${res.licenseType}` : "no"
                    } | expires:  ${res.expires}`
                )
            );
        })();
    },
};
