
require('dotenv').config();

const mongoose = require('mongoose');
const ConnectorType = require('../models/ConnectorType');

const connectorTypes = [
    {
        name: "KCIM",
        type: "kcim",
        description: "Document management and processing platform",
        isActive: true,
        configSchema: {
            tenantName: {
                type: "string",
                required: true,
                description: "KCIM tenant name"
            }
        }
    },
    {
        name: "Google Drive",
        type: "google_drive",
        description: "Cloud storage and file sharing service",
        isActive: true,
        configSchema: {
            clientId: { type: "string", required: true, description: "Google OAuth client ID" },
            clientSecret: { type: "string", required: true, description: "Google OAuth client secret" },
            redirectUri: { type: "string", required: true, description: "OAuth redirect URI" }
        }
    }
];

const seedConnectorTypes = async () => {
    try {
        // Connect to database
        const connectionString = process.env.MONGO_URI;
        if (!connectionString) {
            throw new Error(
                "MongoDB connection string is not set in environment variables."
            );
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ Connected to database');

        // Seed each connector type individually
        for (const connectorTypeData of connectorTypes) {
            const existing = await ConnectorType.findOne({ type: connectorTypeData.type });

            if (existing) {
                console.log(`✓ ConnectorType '${connectorTypeData.name}' already exists - skipping`);
            } else {
                await ConnectorType.create(connectorTypeData);
                console.log(`✓ Created ConnectorType '${connectorTypeData.name}'`);
            }
        }

        console.log('\n Seeding completed successfully');


    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);


    } finally {
        await mongoose.connection.close();
        console.log('✓ Database connection closed');

    }
};

seedConnectorTypes(); 