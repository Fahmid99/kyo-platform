const Connector = require("../../models/Connector.js");
const ConnectorType = require("../../models/ConnectorType.js");

const getAllConnectors = async (req, res) => {
    try {
        const { orgId } = req.claims;

        const connectorTypes = await ConnectorType.find({ isActive: true });
        const orgConnectors = await Connector.find({ orgId });

        const result = connectorTypes.map(connectorType => {
            const activatedConnector = orgConnectors.find(connector =>
                connector.connectorTypeId.toString() === connectorType._id.toString()
            );

            return {
                ...connectorType.toObject(),
                isActivated: !!activatedConnector,
                connector: activatedConnector || null
            };
        });

        return res.status(200).json({ connectors: result });
    } catch (error) {
        console.error('Error getAllConnectors:', error);
        return res.status(500).json({
            message: {
                key: "ERROR_INTERNAL_SERVER",
                description: req.t("ERROR_INTERNAL_SERVER")
            }
        });
    }
};

module.exports = getAllConnectors;