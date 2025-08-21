const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    connectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Connector",
        required: true
    },
    orgId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    templateData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
            validator: function (templateData) {
                return templateData &&
                    templateData.folderLocation &&
                    templateData.documentClass &&
                    Array.isArray(templateData.fieldMappings);
            },
            message: "Invalid template data structure"
        }
    }
}, { timestamps: true });

templateSchema.index({ connectorId: 1, orgId: 1 });
templateSchema.index({ orgId: 1 });

module.exports = mongoose.model("Template", templateSchema);