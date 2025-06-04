const Service = require("../../models/Service.js");

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({});
    return res.status(200).json({ services });
  } catch (error) {
    console.error("Error getAllService:", error);
    return res.status(500).json({
      message: {
        key: "ERROR_INTERNAL_SERVER",
        description: req.t("ERROR_INTERNAL_SERVER"),
      },
    });
  }
};

module.exports = getAllServices;
