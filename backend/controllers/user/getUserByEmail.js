const User = require("../../models/User.js");

const getUserbyEmail = async (req, res) => {
  const email = req.query.email;
  const orgId = req.org?.orgId;

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

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error getUserByEmail:", error);
    return res.status(500).json({
      message: {
        key: "ERROR_INTERNAL_SERVER",
        description: req.t("ERROR_INTERNAL_SERVER"),
      },
    });
  }
};

module.exports = getUserbyEmail;
