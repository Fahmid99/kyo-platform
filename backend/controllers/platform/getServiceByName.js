const Service = require("../../models/Service.js");

const getServiceByName = async (req, res) => {
  const name = req.query.name;
  try {
    const services = await Service.find({ name });
    if (!services || services.length === 0) {
      return res.status(404).json({
        message: {
          key: "ERROR_SERVICE_NOT_FOUND",
          description: req.t("ERROR_SERVICE_NOT_FOUND"),
        },
      });
    }
    return res.status(200).json({ services });
  } catch (error) {
    console.error("Error getServiceByName:", error);
    return res.status(500).json({
      message: {
        key: "ERROR_INTERNAL_SERVER",
        description: req.t("ERROR_INTERNAL_SERVER"),
      },
    });
  }
};

module.exports = getServiceByName;
