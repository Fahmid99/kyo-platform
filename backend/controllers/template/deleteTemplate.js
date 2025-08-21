const Template = require("../../models/Template");

const deleteTemplate = async (req, res) => {
    try {
        const { orgId } = req.claims;
        const { id } = req.params;

        const deleteTemplate = await Template.findOneAndDelete({ _id: id, orgId });

        if (!deleteTemplate) {
            return res.status(404).json({
                message: {
                    key: "ERROR_TEMPLATE_NOT_FOUND",
                    description: req.t("ERROR_TEMPLATE_NOT_FOUND")
                }
            });
        }
        return res.status(200).json({
            message: {
                key: "TEMPLATE_DELETED_SUCCESSFULLY",
                description: req.t("TEMPLATE_DELETED_SUCCESSFULLY")
            }
        });

    } catch (error) {
        console.error("Error deleteTemplate:", error);
        return res.status(500).json({
            message: {
                key: "ERROR_INTERNAL_SERVER",
                description: req.t("ERROR_INTERNAL_SERVER")
            }
        });
    }
}
module.exports = deleteTemplate;

