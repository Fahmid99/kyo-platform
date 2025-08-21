const Template = require('../../models/Template');

const getTemplateById = async (req, res) => {
    try {
        const { orgId } = req.claims;
        const { id } = req.params;

        const template = await Template.findOne({ _id: id, orgId });

        if (!template) {
            return res.status(404).json({
                message: {
                    key: "ERROR_TEMPLATE_NOT_FOUND",
                    description: req.t("ERROR_TEMPLATE_NOT_FOUND")
                }
            });
        }
        return res.status(200).json({
            message: {
                key: "TEMPLATE_FETCHED_SUCCESSFULLY",
                description: req.t("TEMPLATE_FETCHED_SUCCESSFULLY")
            },
            template
        });
    } catch (error) {
        console.error("Error getTemplateById:", error);
        return res.status(500).json({
            message: {
                key: "ERROR_INTERNAL_SERVER",
                description: req.t("ERROR_INTERNAL_SERVER")
            }
        });
    }
}

module.exports = getTemplateById;