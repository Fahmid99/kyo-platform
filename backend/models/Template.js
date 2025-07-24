const mongoose = require("mongoose");

const templateScheme = new mongoose.SchemaType({ 
    connectorId: { 
        type:mongoose.Schema.Types.ObjectId, 
        ref: "Connector", 
        required: true 
    }, 
    name: { 
        type: String, 
        required: true, 
        trim: true, 
    }, 
    description: { 
        type: String, 
        trim: true 
    }, 
    templateData: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true, 
        validate: { 
            validator: async function(templateData) { 
                const Connector = mongoose.model('Connector');
                const connector = await Connector.findById(this.connectorId).populate("platformId");
                if (!connector) return false; 

                if (connector.platformId.type === "kcim") { 
                    return templateData && templateData.folderLocation && templateData.documentClass;

                }
                return true 
            }, 
            message: "Invalid template data"
        }
    }
})