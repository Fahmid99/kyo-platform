const User = require("../../models/User.js");

const getAllUsers = async (req, res) => {
  const orgId = req.org?.orgId;

  try {
    const users = await User.find({ orgId });
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error getAllUsers:", error);
    return res.status(500).json({
      message: {
        key: "ERROR_INTERNAL_SERVER",
        description: req.t("ERROR_INTERNAL_SERVER"),
      },
    });
  }
};

module.exports = getAllUsers;
