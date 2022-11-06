const pgPool = require("../db/pgWrapper");
const tokenDB = require("../db/tokenDB")(pgPool);

module.exports = {
    helloWorld: helloWorld,
};

async function helloWorld(req, res) {
    let barerToken = req.headers.authorization;
    barerToken = barerToken.substring(7, barerToken.length);
    const userId = await tokenDB.getUserIDFromBearerToken2(barerToken)
    res.send(`Hello World OAuth2! UserId: ${userId}`);
}