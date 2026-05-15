import { ChatResult, Intent, IntentResult, ChatContext } from "../types/chat";
import { Property } from "../types/property";
import { buildODataQuery } from "../utils/buildFilter";
import { extractPropertyValues } from "./ai/extractService";
import { identifyIntent } from "./ai/intentService";
import { answerRealEstateQuestions } from "./ai/realEstateAdviceService";
import { answerSpecializedPropertyQuestions } from "./ai/specializedPropertyService";
import { fetchPropertiesWithRoomsMedia } from "./propertyService";
import { getProperty } from "./storageService";
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
export async function handleChat(userQuery: string, context?: ChatContext): Promise<ChatResult> {

    // 1) Classify intent of message with intent service (or use passed intent if available from front end context)
    const intent = context?.intent ?? await identifyIntent(userQuery);

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

        case "clarification":

            // figure out what needs to happen here... respond to the user with a string to clarify and capture that in the front end and feed it back into the function with the new user query and maybe the intent if we want to skip re-classifying intent with the new query since we know its just a clarification of the previous intent
            return { type: "baseString", message: `this is a response for clarification intent with confidence: ${intent.confidence}` };

        case "refinement":
            // take past property array context, pass it all in to filter, return property array back based on that refinement from the user query 
            return { type: "baseString", message: `this is a response for refinement intent with confidence: ${intent.confidence}` };

        case "specific_property":
            // take singular property context, pass it all in to property LLM, return answers as a string
            const specificProperty = getProperty(context?.selectedPropertyId ?? "") as Property;
            
            // call function, pass these things --> that function has the system prompt for it and calls the LLM and returns the response for that specific property question
            const response = await answerSpecializedPropertyQuestions(userQuery, specificProperty);

            return { type: "baseString", message: response.response };
        
        case "other":
            return { type: "baseString", message: `this is a response for other intent with confidence: ${intent.confidence}` };
        
        default:
            return { type: "baseString", message: `could not classify intent with confidence: ${intent.confidence}` };
    }
}