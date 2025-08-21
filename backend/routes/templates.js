const express = require("express");
const router = express.Router();

const getToken = require("../middlewares/getters/getToken.js");
const getClaimsFromToken = require("../middlewares/getters/getClaimsFromToken.js");
const validateOrgId = require("../middlewares/validators/validateOrgId.js");
const validateUser = require("../middlewares/validators/validateUser.js");
const requireOrgAdmin = require("../middlewares/requirers/requireOrgAdmin.js");

const getAllTemplates = require("../controllers/template/getAllTemplates.js");
const createTemplate = require("../controllers/template/createTemplate.js");
const getTemplateById = require("../controllers/template/getTemplateById.js");
const updateTemplate = require("../controllers/template/updateTemplate.js");
const deleteTemplate = require("../controllers/template/deleteTemplate.js");


router.get("/",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    getAllTemplates
);


router.get("/:id",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    getTemplateById
);

router.put("/:id",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    updateTemplate
);


router.post("/",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    createTemplate
);


router.delete("/:id",
    getToken,
    getClaimsFromToken,
    validateOrgId,
    validateUser,
    requireOrgAdmin,
    deleteTemplate
);




module.exports = router;