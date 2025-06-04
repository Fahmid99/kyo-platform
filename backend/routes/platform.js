const express = require("express");
const router = express.Router();

// Middleware
const getToken = require("../middlewares/getters/getToken.js");
const getClaimsFromToken = require("../middlewares/getters/getClaimsFromToken.js");
const validateOrgId = require("../middlewares/validators/validateOrgId.js");
const validateUser = require("../middlewares/validators/validateUser.js");
const validateEmailFormat = require("../middlewares/validators/validateEmailsFormat.js");
const requireOrgAdmin = require("../middlewares/requirers/requireOrgAdmin.js");
const requireName = require("../middlewares/requirers/requireName.js");
const requireEmail = require("../middlewares/requirers/requireEmail.js");

const getAllServices = require("../controllers/platform/getAllServices.js");
const getServiceByName = require("../controllers/platform/getServiceByName.js");
const getServiceById = require("../controllers/platform/getServiceById.js");

router.get(
  "/service",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireOrgAdmin,
  getAllServices
);

router.get(
  "/service/search",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireOrgAdmin,
  requireName,
  getServiceByName
);

router.get(
  "/service/:id",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireOrgAdmin,
  getServiceById
);

module.exports = router;
