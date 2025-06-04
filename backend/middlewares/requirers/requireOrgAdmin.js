const requireOrgAdmin = (req, res, next) => {
  const user = req.user;

  if (!user.roles.includes("organisation-admin")) {
    return res.status(403).json({
      message: {
        key: "ERROR_ACCESS_ORG_ADMIN_REQUIRED",
        description: req.t("ERROR_ACCESS_ORG_ADMIN_REQUIRED"),
      },
    });
  }

  next();
};

module.exports = requireOrgAdmin;
