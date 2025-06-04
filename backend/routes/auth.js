const express = require("express");
const router = express.Router();

// Middlewares
const getToken = require("../middlewares/getters/getToken.js");
const extractClaimsFromToken = require("../middlewares/getters/getClaimsFromToken.js");
const validateOrgId = require("../middlewares/validators/validateOrgId.js");
const validateUser = require("../middlewares/validators/validateUser.js");

// Controllers
const whoami = require("../controllers/authentication/whoami.js");

router.get(
  "/whoami",
  getToken,
  extractClaimsFromToken,
  validateOrgId,
  validateUser,
  whoami
);

module.exports = router;
