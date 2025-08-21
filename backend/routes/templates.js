const express = require("express");
const router = express.Router();

const getToken = require("../middlewares/getters/getToken.js");
const getClaimsFromToken = require("../middlewares/getters/getClaimsFromToken.js");
const validateOrgId = require("../middlewares/validators/validateOrgId.js");
const validateUser = require("../middlewares/validators/validateUser.js");
const requireOrgAdmin = require("../middlewares/requirers/requireOrgAdmin.js");

const getAllTemplates = require("../controllers/template/getAllTemplates.js");
const createTemplate = require("../controllers/template/createTemplate.js");

router.get("/",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    getAllTemplates
);

router.post("/",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    createTemplate
);





module.exports = router;