const Template = require("../../models/Template.js");

const updateTemplate = async (req, res) => {
    try {
        const { orgId } = req.claims;
        const { id } = req.params;

        const { name, description, templateData } = req.body;

        const updatedTemplate = await Template.findOneAndUpdate(
            { _id: id, orgId },
            { name, description, templateData },
            { new: true }
        )

        if (!updatedTemplate) {
            return res.status(404).json({
                message: {
                    key: "ERROR_TEMPLATE_NOT_FOUND",
                    description: req.t("ERROR_TEMPLATE_NOT_FOUND")
                }
            });
        }
        return res.status(200).json({
            message: {
                key: "TEMPLATE_UPDATED_SUCCESSFULLY",
                description: req.t("TEMPLATE_UPDATED_SUCCESSFULLY")
            },
            template: updatedTemplate
        });

    } catch (error) {
        console.error("Error updateTemplate:", error);
        return res.status(500).json({
            message: {
                key: "ERROR_INTERNAL_SERVER",
                description: req.t("ERROR_INTERNAL_SERVER")
            }
        });
    }
}

module.exports = updateTemplate;