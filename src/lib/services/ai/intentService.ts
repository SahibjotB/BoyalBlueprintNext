/* Call this with user query to build system prompt to identify intent */

import { IntentResult } from "@/lib/types/chat";
import { generateOutput } from "./llmService";

export async function identifyIntent(userQuery:string): Promise<IntentResult> {

    // Instructions for how the AI should take the user query and work with it
    const systemPrompt = 
    `You are an intent classification system for a real estate application. Your task is to analyze user queries and classify them into one of the following intents: "property_search", "real_estate", or "other".
        - property_search: This intent is for users who are looking for properties to buy or rent. They may ask about available listings, property details, prices, locations. I want to purchase, rent. I am looking for a property in this city under this price etc, gives a city name like Oakville, Toronto, Missisauga, Brampton etc along with a price point usually.
        - real_estate: This intent is for users who are interested in general information about real estate, such as market trends, investment advice, mortgage information, budgets, downpayments, etc.
        - specific_property: This intent is when users ask about a specific property. You can identify this based on them asking a question containing a specific address. Words like "street, avenue, crescent, road, parkway, trail, drive, circle, lane, court, boulevard, place, way" and similar are often used 
        - other: This intent is for queries that do not fit into the above categories

    When you receive a user query, analyze the content and determine the most appropriate intent. Provide a confidence score for your classification, which should be a number between 0 and 1, indicating how confident you are in your classification.
    `;

    const returnEnum = ["property_search", "real_estate", "specific_property", "other"];

    // Define the expected schema for the LLM response to ensure we get structured data back that we can work with
    const intentResultSchema = {
        name: "intent_classification",
        schema: {
            type: "object",
            properties: {
                intent: {
                    type: "string",
                    enum: returnEnum
                },
                confidence: {
                    type: "number",
                    minimum: 0,
                    maximum: 1
                }
            },
            required: ["intent", "confidence"],
            additionalProperties: false
        }
    }
    
    // call llm service with system prompt and user query, specify structured output with schema for expected return format
    const response = await generateOutput<IntentResult>({ systemPrompt, userPrompt: userQuery, schema: intentResultSchema, caller: "intentService" });
    return response;
}
