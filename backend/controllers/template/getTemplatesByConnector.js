const Template = require('../../models/Template');


const getTemplatesByConnector = async (req, res) => {
    try {
        const { orgId } = req.claims;

        const { id } = req.params;

        const templates = await Template.find({ orgId, connectorId: id });
        console.log(templates);
        if (!templates || templates.length === 0) {
            return res.status(404).json({
                message: {
                    key: "ERROR_TEMPLATES_NOT_FOUND",
                    description: req.t("ERROR_TEMPLATES_NOT_FOUND")
                }
            });
        }
        return res.status(200).json({ templates });

    } catch (error) {
        console.error('Error getTemplatesByConnector:', error);
        return res.status(500).json({
            message: {
                key: "ERROR_INTERNAL_SERVER",
                description: req.t("ERROR_INTERNAL_SERVER")
            }
        });
    }
}
module.exports = getTemplatesByConnector;