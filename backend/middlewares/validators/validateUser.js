const User = require("../../models/User");

const validateUser = async (req, res, next) => {
  const orgId = req.claims?.orgId;
  const email = req.claims?.email;

  if (!email) {
    return res.status(400).json({
      message: {
        key: "ERROR_EMAIL_REQUIRED",
        description: req.t("ERROR_EMAIL_REQUIRED"),
      },
    });
  }

  try {
    const user = await User.findOne({ email, orgId });
    if (!user) {
      return res.status(404).json({
        message: {
          key: "ERROR_EMAIL_NOT_FOUND",
          description: req.t("ERROR_EMAIL_NOT_FOUND"),
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: {
        key: "ERROR_INTERNAL_SERVER",
        description: req.t("ERROR_INTERNAL_SERVER"),
      },
    });
  }
};

module.exports = validateUser;
