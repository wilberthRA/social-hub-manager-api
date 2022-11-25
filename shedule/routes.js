module.exports = (router,app, schedule) => {
    router.post("/create", app.oauth.authorise(), schedule.registerSchedule);
    router.get("/", app.oauth.authorise(), schedule.getSchedules);
    router.delete("/delete/:id", app.oauth.authorise(), schedule.deleteSchedule);
    return router;
};