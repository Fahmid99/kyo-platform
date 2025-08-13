require('dotenv').config();
const mongoose = require('mongoose');
const ConnectorType = require('./models/ConnectorType');

const getConnectorIds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const connectorTypes = await ConnectorType.find();
        console.log('Available ConnectorTypes:');
        connectorTypes.forEach(ct => {
            console.log(`ID: ${ct._id} | Name: ${ct.name} | Type: ${ct.type}`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

getConnectorIds();