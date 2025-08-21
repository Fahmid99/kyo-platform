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
const deactivateConnector = require("../controllers/connector/deactivateConnector.js");
const reactivateConnector = require("../controllers/connector/reactivateConnector.js");
const getConnectorById = require("../controllers/connector/getConnectorById.js");
const getTemplatesByConnector = require("../controllers/template/getTemplatesByConnector.js");



router.get("/", getToken, getClaimsFromToken, validateOrgId, validateUser, requireOrgAdmin, getAllConnectors);


router.get("/:id", getToken, getClaimsFromToken, validateOrgId, validateUser, requireOrgAdmin, getConnectorById);


router.get("/:id/templates",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    getTemplatesByConnector
);

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

router.put(
    "/:id/deactivate",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    deactivateConnector
);


router.put(
    "/:id/reactivate",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    reactivateConnector
);

router.get(
    "/:connectorId/templates",
    getToken,

);



module.exports = router; 