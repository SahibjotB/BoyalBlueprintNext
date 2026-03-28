import { ChatResult } from "../types/chat";
import { buildODataQuery } from "../utils/buildFilter";
import { extractPropertyValues } from "./ai/extractService";
import { identifyIntent } from "./ai/intentService";

/* 
    The full orchetrator of handling all chat calls from chat API route when called in from front-end 
        - Handles intent & calls different services and functions based on intent classification
        - Can handle session context and saving 
        - Handle clarification responses to the user
        - Handle any text flow logic for the chat interactions in one place to keep the front end simple (keeps all logic in one place and calls the right needed services)

*/

// Expand to handle session context and saving 
export async function handleChat(userQuery: string): Promise<ChatResult> {

// 1) Classify intent of message with intent service
const intent = await identifyIntent(userQuery);
    switch(intent.intent) {
        // Return with ChatResult type makes it easy to handle what comes back in the front end and ensures we have a consistent format for all responses
        case "property_search":
            // passing the type here lets us know what to expect and what is required to be sent back such as a string message here but could be more complex types as well with more data for the front end to work with
            // calls to extraction service 
            const propertyFilters = await extractPropertyValues(userQuery);
            console.log("Extracted property filters:", propertyFilters);
        
            const odataQueryString = await buildODataQuery(propertyFilters.filters);
            console.log("Generated OData query string:", odataQueryString);

            return { type: "test", message: `queryString: ${odataQueryString}`};
        case "real_estate":
            return { type: "test", message: `this is a response for real estate intent with confidence: ${intent.confidence}` };
        case "other":
            return { type: "test", message: `this is a response for other intent with confidence: ${intent.confidence}` };
        default:
            return { type: "test", message: `could not classify intent with confidence: ${intent.confidence}` };
    }
}