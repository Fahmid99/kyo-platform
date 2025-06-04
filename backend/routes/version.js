const express = require("express");
const router = express.Router();

const getBuildVersion = require("../controllers/version/getBuildVersion.js");

router.get("/", getBuildVersion);

module.exports = router;
