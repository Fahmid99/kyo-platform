const User = require("../../models/User.js");

const deleteUserById = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const orgId = req.org?.orgId;

  try {
    const toDeleteUser = await User.findOne({ _id: id, orgId });
    if (!toDeleteUser) {
      return res.status(404).json({
        message: {
          key: "ERROR_ID_NOT_FOUND",
          description: req.t("ERROR_ID_NOT_FOUND"),
        },
      });
    }

    // Check if user is self-deleting themselves
    if (toDeleteUser._id.toString() === user._id.toString()) {
      return res.status(403).json({
        message: {
          key: "ERROR_USER_SELF_DELETION",
          description: req.t("ERROR_USER_SELF_DELETION"),
        },
      });
    }

    const deletedUser = await User.findOneAndDelete({ _id: id, orgId });
    if (!deletedUser) {
      return res.status(404).json({
        message: {
          key: "ERROR_ID_NOT_FOUND",
          description: req.t("ERROR_ID_NOT_FOUND"),
        },
      });
    }

    return res.status(200).json({
      message: {
        key: "SUCCESS_USER_DELETED",
        description: req.t("SUCCESS_USER_DELETED"),
      },
      deletedUser,
    });
  } catch (error) {
    console.error("Error deleteUserById:", error);
    return res.status(500).json({
      message: {
        key: "ERROR_INTERNAL_SERVER",
        description: req.t("ERROR_INTERNAL_SERVER"),
      },
    });
  }
};

module.exports = deleteUserById;
