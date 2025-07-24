const mongoose = require("mongoose");

const connectorSchema = new mongoose.Schema({
    platformId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Platform",
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
            validator: async function(config) {
                // Get the platform to check what type it is
                const platform = await mongoose.model('Platform').findById(this.platformId);
                if (!platform) return false;
                
                if (platform.type === 'kcim') {
                    // Validate KCIM config has required fields
                    return config && 
                           typeof config.tenantId === 'string' && config.tenantId.length > 0 &&
                           typeof config.apiEndpoint === 'string' && config.apiEndpoint.length > 0;
                } else if (platform.type === 'google_drive') {
                    // Validate Google Drive config has required fields
                    return config &&
                           typeof config.clientId === 'string' && config.clientId.length > 0 &&
                           typeof config.clientSecret === 'string' && config.clientSecret.length > 0 &&
                           typeof config.redirectUri === 'string' && config.redirectUri.length > 0;
                }
                return true;
            },
            message: 'Invalid config structure for this platform type'
        }
    }
}, {
    timestamps: true  // Moved to options object
});

// Ensure one platform per org (prevent duplicates)
connectorSchema.index({ platformId: 1, orgId: 1 }, { unique: true });

// Performance indexes
connectorSchema.index({ orgId: 1 });
connectorSchema.index({ platformId: 1 });

module.exports = mongoose.model("Connector", connectorSchema);