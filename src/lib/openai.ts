/* Configure instance of OpenAI client for Azure for use in llmService */
import OpenAI from "openai";

// simply wrapper around OpenAI to configure client for usage
export const openAIClient = new OpenAI({
    baseURL: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_KEY || "dummy-key-for-build"
});