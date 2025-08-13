const { mongoose } = require("mongoose");
const Connector = require("../../models/Connector.js");
const ConnectorType = require("../../models/ConnectorType.js");
const User = require("../../models/User.js");

const createConnector = async (req, res) => {
    try {
        const { connectorTypeId, config } = req.body;
        const { orgId, email } = req.claims;

        const connectorTypeExists = await ConnectorType.exists({ _id: connectorTypeId, isActive: true });


        // Validate the connector type exists if not then return 404 not found
        if (!connectorTypeExists) {
            return res.status(404).json({
                message: {
                    key: "ERROR_CONNECTOR_TYPE_NOT_FOUND",
                    description: req.t("ERROR_CONNECTOR_TYPE_NOT_FOUND")
                }
            });
        }

        const connectorExists = await Connector.exists({ connectorTypeId, orgId });
        if (connectorExists) {
            return res.status(400).json({
                message: {
                    key: "ERROR_CONNECTOR_ALREADY_EXISTS",
                    description: req.t("ERROR_CONNECTOR_ALREADY_EXISTS")
                }
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: {
                    key: "ERROR_USER_NOT_FOUND",
                    description: req.t("ERROR_USER_NOT_FOUND")
                }
            });
        }

        const newConnector = new Connector({
            connectorTypeId,
            orgId,
            activatedBy: user._id,
            config
        });
        await newConnector.save();

        return res.status(201).json({
            message: {
                key: "CONNECTOR_CREATED_SUCCESSFULLY",
                description: req.t("CONNECTOR_CREATED_SUCCESSFULLY")
            },
            connector: newConnector
        });

    } catch (error) {
        console.error("Error createConnector:", error);
        return res.status(500).json({
            message: {
                key: "ERROR_INTERNAL_SERVER",
                description: req.t("ERROR_INTERNAL_SERVER")
            }
        });
    }
};

module.exports = createConnector; 