import { ChatResult } from "../types/chat";
import { buildODataQuery } from "../utils/buildFilter";
import { extractPropertyValues } from "./ai/extractService";
import { identifyIntent } from "./ai/intentService";
import { answerRealEstateQuestions } from "./ai/realEstateAdviceService";
import { fetchPropertiesWithRoomsMedia } from "./propertyService";

/* 
    The full orchetrator of handling all chat calls from chat API route when called in from front-end 
        - Handles intent & calls different services and functions based on intent classification
        - Can handle session context and saving 
        - Handle clarification responses to the user
        - Handle any text flow logic for the chat interactions in one place to keep the front end simple (keeps all logic in one place and calls the right needed services)

*/

// figure out pre-context
// have an if- logged in flag (display info at the top)
// have a flag for passed property context (feed that in at the start when its triggered) -> reset when not.. 

// Expand to handle session context and saving 
export async function handleChat(userQuery: string): Promise<ChatResult> {

    // 1) Classify intent of message with intent service
    const intent = await identifyIntent(userQuery);

    // 2) Act upon the identified intent with different behaviors for chat returns
    switch(intent.intent) {
        // Return with ChatResult type makes it easy to handle what comes back in the front end and ensures we have a consistent format for all responses
        case "property_search":
            // passing the type here lets us know what to expect and what is required to be sent back such as a string message here but could be more complex types as well with more data for the front end to work with
            // calls to extraction service 
            const propertyFilters = await extractPropertyValues(userQuery);
            console.log("Extracted property filters:", propertyFilters);
        
            const odataQueryString = await buildODataQuery(propertyFilters.filters);
            console.log("Generated OData query string:", odataQueryString);

            // call Property API with query

            const propertiesList = await fetchPropertiesWithRoomsMedia(odataQueryString, 5);
    
            // Return array of Property objects (show a few of them and say you can view more listings and save them (login prompt?))
            return { type: "propertyList", message: propertiesList };

        case "real_estate":
            const realEstateResponse = await answerRealEstateQuestions(userQuery)
            return { type: "baseString", message: realEstateResponse.response };
            
        case "other":
            return { type: "baseString", message: `this is a response for other intent with confidence: ${intent.confidence}` };
        default:
            return { type: "baseString", message: `could not classify intent with confidence: ${intent.confidence}` };
    }
}