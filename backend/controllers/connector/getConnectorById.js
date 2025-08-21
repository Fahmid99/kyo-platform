const Connector = require("../../models/Connector.js");

const getConnectorById = async (req, res) => {
    try {
        const { id } = req.params;
        const { orgId } = req.claims;

        const connector = await Connector.findOne({ _id: id, orgId });

        if (!connector) {
            return res.status(404).json({
                message: {
                    key: "ERROR_CONNECTOR_NOT_FOUND",
                    description: req.t("ERROR_CONNECTOR_NOT_FOUND")
                }
            });

        }

        return res.status(200).json({
            message: {
                key: "CONNECTOR_FETCHED_SUCCESSFULLY",
                description: req.t("CONNECTOR_FETCHED_SUCCESSFULLY")
            },
            connector: connector
        });


    } catch (error) {
        console.error("Error getConnectorById:", error);
        return res.status(500).json({
            message: {
                key: "ERROR_INTERNAL_SERVER",
                description: req.t("ERROR_INTERNAL_SERVER")
            }
        });
    }
}

module.exports = getConnectorById;
