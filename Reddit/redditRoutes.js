const express = require("express");

const router = express.Router();

const redditController = require("./redditController");

router.post("/callback", redditController.auth);
router.post("/makepost", redditController.makePost);


module.exports = router;