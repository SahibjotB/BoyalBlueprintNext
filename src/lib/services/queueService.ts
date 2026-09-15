import { QueueClient, QueueServiceClient } from "@azure/storage-queue";

// add this to environment variables
const queueName = process.env.AZURE_SEARCH_QUEUE_NAME ?? "property-search-jobs";

// setup connection client
function getQueueClient() : QueueClient {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error("AZURE_STORAGE_CONNECTION_STRING environment variable is not set.");
    }
    const serviceClient = QueueServiceClient.fromConnectionString(connectionString);
    return serviceClient.getQueueClient(queueName);
}

// start the queue if it doesn't exist otherwise get the existing one to use
export async function initializeSearchQueue() {
    const queueClient = getQueueClient();

    await queueClient.createIfNotExists();
}

// start a new search job by adding a message to the queue with the searchId
export async function enqueueSearchJob(searchId: string) {
    const queueClient = getQueueClient();
    await queueClient.createIfNotExists();

    const message = JSON.stringify({ searchId });
    // processing search which is stored in azure db
    await queueClient.sendMessage(Buffer.from(message).toString('base64'));
}

