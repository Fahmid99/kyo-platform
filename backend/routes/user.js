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

// User Controllers
const createUser = require("../controllers/user/createUser.js");
const getUserByEmail = require("../controllers/user/getUserByEmail.js");
const getUserById = require("../controllers/user/getUserById.js");
const getAllUsers = require("../controllers/user/getAllUsers.js");
const updateUserById = require("../controllers/user/updateUserById.js");
const deleteUserById = require("../controllers/user/deleteUserById.js");

// This route is used to create a user in the platform
router.post(
  "/",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireOrgAdmin,
  validateEmailFormat,
  requireName,
  createUser
);

// This route is used to get the list of user of the requestor's organisation in the platform
router.get(
  "/",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireOrgAdmin,
  getAllUsers
);

// This route is used to get a specific user in the platform by email
router.get(
  "/search",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireEmail,
  validateEmailFormat,
  getUserByEmail
);

// This route is used to get a specific user in the platform by ID
router.get(
  "/:id",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireOrgAdmin,
  getUserById
);

// This route is used to update a user in the platform
router.put(
  "/:id",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireOrgAdmin,
  validateEmailFormat,
  updateUserById
);

// This route is used to delete a user in the platform
router.delete(
  "/:id",
  getToken,
  getClaimsFromToken,
  validateOrgId,
  validateUser,
  requireOrgAdmin,
  validateEmailFormat,
  deleteUserById
);

module.exports = router;
