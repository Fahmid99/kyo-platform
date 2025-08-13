require('dotenv').config();
const mongoose = require('mongoose');
const ConnectorType = require('./models/ConnectorType');
const Connector = require('./models/Connector');

const testGetAllConnectors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');

        // Test the logic from your controller
        const connectorTypes = await ConnectorType.find({ isActive: true });
        console.log('\n📋 All ConnectorTypes:');
        console.log(connectorTypes);

        // Test with a fake orgId
        const testOrgId = "test-org-123";
        const orgConnectors = await Connector.find({ orgId: testOrgId });
        console.log('\n🏢 Org Connectors for', testOrgId, ':');
        console.log(orgConnectors);

        // Test the mapping logic
        const result = connectorTypes.map(connectorType => {
            const activatedConnector = orgConnectors.find(connector => 
                connector.connectorTypeId.toString() === connectorType._id.toString()
            );
            
            return {
                ...connectorType.toObject(),
                isActivated: !!activatedConnector,
                connector: activatedConnector || null
            };
        });

        console.log('\n✨ Final Result:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.connection.close();
    }
};

testGetAllConnectors();