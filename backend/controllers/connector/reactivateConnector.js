const Connector = require("../../models/Connector.js");

const reactivateConnector = async (req, res) => {

    try {
        const { id } = req.params;
        const { orgId } = req.claims;

        const connector = await Connector.findOneAndUpdate(
            { _id: id, orgId, status: 'pendingDeletion' },
            { status: 'active', deletionScheduledAt: null },
            { new: true }
        );

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
                key: "CONNECTOR_REACTIVATED_SUCCESSFULLY",
                description: req.t("CONNECTOR_REACTIVATED_SUCCESSFULLY")
            },
            connector
        });
    } catch (error) {
        console.error("Error reactivating connector:", error.message, { id, orgId });
        return res.status(500).json({
            message: {
                key: "ERROR_REACTIVATING_CONNECTOR",
                description: req.t("ERROR_REACTIVATING_CONNECTOR")
            }
        });
    }
}

module.exports = reactivateConnector;

