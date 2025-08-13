const Connector = require("../../models/Connector.js");

const updateConnector = async (req, res) => {
    try {
        const { id } = req.params;

        const { config } = req.body;
        const { orgId } = req.claims;

        console.log("Config received:", config);
        console.log("ID received:", id);
        console.log("Type of config:", typeof config);




        const connectorExists = await Connector.findOne({ _id: id, orgId });


        if (!connectorExists) {
            return res.status(404).json({
                message: {
                    key: "ERROR_CONNECTOR_NOT_FOUND",
                    description: req.t("ERROR_CONNECTOR_NOT_FOUND")
                }
            });
        }

        //Manual validation 
        const ConnectorType = require("../../models/ConnectorType.js");
        const connectorType = await ConnectorType.findById(connectorExists.connectorTypeId);

        if (connectorType.type === 'kcim') {
            if (!config?.tenantName?.length) {
                return res.status(400).json({
                    message: {
                        key: "ERROR_INVALID_CONFIG",
                        description: "KCIM requires a valid tenantName"
                    }
                });
            }
        }

        const updatedConnector = await Connector.findOneAndUpdate(
            { _id: id },
            {
                config,
            },
            {
                new: true,

            }
        );

        if (!updatedConnector) {
            return res.status(500).json({
                message: {
                    key: "ERROR_UPDATING_CONNECTOR",
                    description: req.t("ERROR_UPDATING_CONNECTOR")
                }
            });
        }
        return res.status(200).json({
            message: {
                key: "CONNECTOR_UPDATED_SUCCESSFULLY",
                description: req.t("CONNECTOR_UPDATED_SUCCESSFULLY")
            },
            connector: updatedConnector
        });
    } catch (error) {
        console.error("Error updateConnector:", error);

        // Handle specific error cases
        //case where config validation fails
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: {
                    key: "ERROR_INVALID_CONFIG",
                    description: req.t("ERROR_INVALID_CONFIG")
                }
            });
        }
        // case where database connection fails
        return res.status(500).json({
            message: {
                key: "ERROR_INTERNAL_SERVER",
                description: req.t("ERROR_INTERNAL_SERVER")
            }
        });
    }
};

module.exports = updateConnector; 