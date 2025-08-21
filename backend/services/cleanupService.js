const cron = require("node-cron");
const Connector = require("../models/Connector.js");

const cleanupExpiredConnectors = async () => {
    try {
        console.log("Starting cleanup of expired connectors...");
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const expiredConnectors = await Connector.find({
            status: 'pendingDeletion',
            deletionScheduledAt: { $lte: thirtyDaysAgo }
        });

        console.log(`Found ${expiredConnectors.length} expired connectors to delete.`);

        //delete expired connectors
        for (const connector of expiredConnectors) {

            await Connector.findByIdAndDelete(connector._id);
            console.log(`Deleted connector with ID: ${connector._id}`);
        }
        console.log("Cleanup of expired connectors completed.");

    } catch (error) {
        console.log("Error during cleanup of expired connectors:", error);
    }
};

// Schedule the cleanup to run every minute
const startCleanupSchedule = () => {
    console.log("Starting cleanup schedule...");
    cron.schedule('0 2 * * *', cleanupExpiredConnectors);
    console.log("Cleanup schedule started: Every day at 2 AM");
};

module.exports = {
    startCleanupSchedule,
    cleanupExpiredConnectors
};
