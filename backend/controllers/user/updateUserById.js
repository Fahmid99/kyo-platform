const User = require("../../models/User.js");

const updateUserById = async (req, res) => {
  const { name, roles, email: newEmail, eulaAccepted, status } = req.body;
  const { id } = req.params;
  const orgId = req.org?.orgId;

  try {
    const user = await User.findOne({ _id: id, orgId });
    if (!user) {
      return res.status(404).json({
        message: {
          key: "ERROR_ID_NOT_FOUND",
          description: req.t("ERROR_ID_NOT_FOUND"),
        },
      });
    }

    // If email is being changed, check if it's already taken
    if (newEmail && newEmail !== user.email) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(409).json({
          message: {
            key: "ERROR_EMAIL_ALREADY_EXISTS",
            description: req.t("ERROR_EMAIL_ALREADY_EXISTS"),
          },
        });
      }
    }

    // Update fields
    user.name = name ?? user.name;
    user.roles = roles ?? user.roles;
    user.eulaAccepted = eulaAccepted ?? user.eulaAccepted;
    user.status = status ?? user.status;
    if (newEmail && newEmail !== currentEmail) {
      user.email = newEmail;
    }

    await user.save();

    return res.status(200).json({
      message: {
        key: "SUCCESS_USER_UPDATED",
        description: req.t("SUCCESS_USER_UPDATED"),
      },
      user,
    });
  } catch (error) {
    console.error("Error updateUserById:", error);
    return res.status(500).json({
      message: {
        key: "ERROR_INTERNAL_SERVER",
        description: req.t("ERROR_INTERNAL_SERVER"),
      },
    });
  }
};

module.exports = updateUserById;
