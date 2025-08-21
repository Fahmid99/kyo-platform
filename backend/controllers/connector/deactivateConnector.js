
const Connector = require("../../models/Connector.js");
const deactivateConnector = async (req, res) => {

    try {
        const { id } = req.params;
        const { orgId } = req.claims;

        const deactivatedConnector = await Connector.findOneAndUpdate(
            { _id: id, orgId },
            {
                status: 'pendingDeletion',
                deletionScheduledAt: new Date()
            },
            { new: true }
        );
        if (!deactivatedConnector) {
            return res.status(404).json({
                message: {
                    key: "ERROR_CONNECTOR_NOT_FOUND",
                    description: req.t("ERROR_CONNECTOR_NOT_FOUND")
                }
            })
        }

        return res.status(200).json({
            message: {
                key: "CONNECTOR_DEACTIVATED_SUCCESSFULLY",
                description: req.t("CONNECTOR_DEACTIVATED_SUCCESSFULLY")
            },
            connector: deactivatedConnector
        });

    }

    catch (error) {
        console.error("Error deactivating connector:", error.message, { id, orgId });
        return res.status(500).json({
            message: {
                key: "ERROR_DEACTIVATING_CONNECTOR",
                description: req.t("ERROR_DEACTIVATING_CONNECTOR")
            }
        })
    }

}

module.exports = deactivateConnector;