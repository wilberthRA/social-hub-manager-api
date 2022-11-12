module.exports = (router, app, authenticator) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login", app.oauth.grant(), authenticator.login);
    router.post("/2fa", authenticator.twoFa);
    router.post("/2fa/verify", authenticator.verify2fa);
    return router;
};