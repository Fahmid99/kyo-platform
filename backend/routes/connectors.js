const express = require("express");
const router = express.Router();

const getToken = require("../middlewares/getters/getToken.js");
const getClaimsFromToken = require("../middlewares/getters/getClaimsFromToken.js");
const validateOrgId = require("../middlewares/validators/validateOrgId.js");
const validateUser = require("../middlewares/validators/validateUser.js");
const requireOrgAdmin = require("../middlewares/requirers/requireOrgAdmin.js");

const getAllConnectors = require("../controllers/connector/getAllConnectors.js");
const createConnector = require("../controllers/connector/createConnector.js");
const updateConnector = require("../controllers/connector/updateConnector.js");

router.get("/", getToken, getClaimsFromToken, validateOrgId, validateUser, requireOrgAdmin, getAllConnectors);
router.post(
    "/",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    createConnector
);

router.put(
    "/:id",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    updateConnector
);



module.exports = router; 