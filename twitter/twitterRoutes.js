const express = require("express");

const router = express.Router();

const twitterController = require("./twitterController");

router.post("/callback", twitterController.auth);
router.post("/makepost",twitterController.makePost);
router.get("/url", twitterController.url);

module.exports = router;