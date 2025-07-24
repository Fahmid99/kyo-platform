const mongoose = require("mongoose");

const platformScheme = new mongoose.Schema({

    name: {
        type: String, required: true, unique: true, trim: true
    },

    type: {
        type: String,
        required: true,
        unique: true,
        enum: ['kcim', 'google_drive'],
        index: true
    },

    //Optional 
    description: {
        type: String,
        trim: true
    },

    iconUrl: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true  // For filtering active platforms
    },
    // Configuration schema for this platform type
    configSchema: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});