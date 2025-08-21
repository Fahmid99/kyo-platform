const Template = require("../../models/Template.js");
const Connector = require("../../models/Connector.js");
const User = require("../../models/User.js");
const createTemplate = async (req, res) => {
    try {
        const { orgId, email} = req.claims;

        const { name, description, connectorId, templateData } = req.body;

        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({
                message: {
                    key: "ERROR_USER_NOT_FOUND",
                    description: req.t("ERROR_USER_NOT_FOUND")
                }
            });
        }

        const newTemplate = new Template({
            name,
            description,
            connectorId,
            orgId,
            createdBy: user._id,
            templateData
        });

        await newTemplate.save();

        return res.status(201).json({
            message: {
                key: "TEMPLATE_CREATED_SUCCESSFULLY",
                description: req.t("TEMPLATE_CREATED_SUCCESSFULLY")
            },
            template: newTemplate
        });


    } catch (error) {
        console.error("Error creating template:", error);
        return res.status(500).json({
            message: {
                key: "ERROR_CREATING_TEMPLATE",
                description: req.t("ERROR_CREATING_TEMPLATE")
            }
        });
    }
}

module.exports = createTemplate;