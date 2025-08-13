const mongoose = require("mongoose");

const connectorSchema = new mongoose.Schema({
    connectorTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ConnectorType",
        required: true
    },
    orgId: {
        type: String,
        required: true
    },
    activatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    config: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
            validator: async function (config) {
  
                console.log("🔍 In validator:", config);
                console.log("this.connectorTypeId:", connectorTypeId);
  
                // Use the exact model name
                const ConnectorType = mongoose.model('ConnectorType');
                const connectorType = await ConnectorType.findById(connectorTypeId);

                if (!connectorType) return false;

                if (connectorType.type === 'kcim') {
                    return config &&
                        typeof config.tenantName === 'string' && config.tenantName.length > 0;
                } else if (connectorType.type === 'google_drive') {
                    return config &&
                        typeof config.clientId === 'string' && config.clientId.length > 0 &&
                        typeof config.clientSecret === 'string' && config.clientSecret.length > 0 &&
                        typeof config.redirectUri === 'string' && config.redirectUri.length > 0;
                }
                return true;
            },
            message: 'Invalid config structure for this connector-type'
        }
    }
}, {
    timestamps: true  // Moved to options object
});

// Ensure one platform per org (prevent duplicates)
connectorSchema.index({ connectorTypeId: 1, orgId: 1 }, { unique: true });

// Performance indexes
connectorSchema.index({ orgId: 1 });
connectorSchema.index({ connectorTypeId: 1 });

module.exports = mongoose.model("Connector", connectorSchema);