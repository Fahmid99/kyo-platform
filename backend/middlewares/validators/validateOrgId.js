const Organisation = require("../../models/Organisation");

const validateOrgId = async (req, res, next) => {
  const orgId = req.claims?.orgId;
  if (!orgId) {
    return res.status(400).json({
      message: {
        key: "ERROR_ORG_REQUIRED",
        description: req.t("ERROR_ORG_REQUIRED"),
      },
    });
  }

  try {
    const org = await Organisation.findOne({ orgId });
    if (!org) {
      return res.status(404).json({
        message: {
          key: "ERROR_ORG_NOT_FOUND",
          description: req.t("ERROR_ORG_NOT_FOUND"),
        },
      });
    }

    req.org = org;
    next();
  } catch (error) {
    res.status(500);
  }
};

module.exports = validateOrgId;
