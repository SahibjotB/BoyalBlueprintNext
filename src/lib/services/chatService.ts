import { ChatResult, Intent, IntentResult, ChatContext, ActiveSearchCriteria, FilterItem, PropertyOperator } from "../types/chat";
import { mapPropertyAddressData, Property, stripMediaData } from "../types/property";
import { buildODataQuery } from "../utils/buildFilter";
import { extractPropertyValues } from "./ai/extractService";
import { identifyIntent } from "./ai/intentService";
import { refinePropertySearch } from "./ai/propertySearchRefinementService";
import { answerRealEstateQuestions } from "./ai/realEstateAdviceService";
import { identifySpecializedProperty } from "./ai/specializedPropertyIdentifierService";
import { answerSpecializedPropertyQuestions } from "./ai/specializedPropertyService";
import { fetchMLSProperties } from "./propertyService";
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

// HISTORY should I do it with UserQuery getting updated or stored history and then feed that in as context with the new user query each time? I think the second one is better for keeping track of the conversation and having that available for the LLM to use as context when needed instead of just the new user query each time which would lose a lot of the conversation history and context that could be relevant for the LLM to generate better responses.

export async function testIntent(userQuery: string, context?: ChatContext): Promise<ChatResult> {
    const intent = context?.intent ?? await identifyIntent(userQuery);
    console.log(`this is the intent ${intent.intent}`);
    return { type: "text", content: `this is a response for ${intent.intent} intent with confidence: ${intent.confidence}` }; 
}

// Expand to handle session context and saving 
export async function handleChat(userQuery: string, context?: ChatContext): Promise<ChatResult> {

    // 1) Classify intent of message with intent service (or use passed intent if available from front end context)
    const intent = context?.intent ?? await identifyIntent(userQuery);

    // 2) Act upon the identified intent with different behaviors for chat returns
    switch(intent.intent) {
        // Return with ChatResult type makes it easy to handle what comes back in the front end and ensures we have a consistent format for all responses
        case "property_search":
            let propertiesList: Property[] = [];

            // calls to extraction service 
            const propertyFilterExtractionResult = await extractPropertyValues(userQuery);

            // if missing CORE values are determined 
            if (propertyFilterExtractionResult.needsClarification) {
                // return with clarification type and content to show to the user and also update the context with what fields are missing so that when the user responds with the clarification we have that context available to know what they are clarifying about 
                
                //*** DO I WANT TO DELIVERY THE ENTIRE CONTEXT BACK IN CONTEXT UPDATE? PASSING IN THE PREVIOUS CONTEXT */
                return { type: "clarification", missingFields: propertyFilterExtractionResult.missingFields, contextUpdate: { intent: intent } };
            }   
            
            /* BASE MLS Filtering logic: get values here and then build OData query string to send to the property API to get results back based on those filters. */
            const MLSBaseFilter = propertyFilterExtractionResult.filters.filter(filter => filter.key === "city" || filter.key === "price");
            const odataQueryString = await buildODataQuery(MLSBaseFilter);

            console.log("Generated OData query string:", odataQueryString);

            // Store activeFilters. Not actively using them
            const activeFilters = propertyFilterExtractionResult.activeFilters;

            /* MLS Property search. Update originalPropertyList */
            // Either search context has changed or there is no existing property list 
            if(hasSearchCriteriaChanged(context?.searchState?.activeSearchCriteria, MLSBaseFilter) || context?.searchState?.originalPropertyResults == null) {
                propertiesList = await fetchMLSProperties(odataQueryString, 5);

                // if activeFilters have values we have to refine this further with these filters so just send propertyList and search query to the refinement function
                const filteredPropertyIdsResponse = await refinePropertySearch(userQuery, stripMediaData(propertiesList)); 
                const refinedPropertiesList = propertiesList.filter(property => filteredPropertyIdsResponse.ids.includes(property.id));

            } else {
                /* Else refinement search. Update refined propertyList instead of origional */


            }

            
            

            /* Update all context and return */

            

            // call Property API with query

            

            // Return array of Property objects (show a few of them and say you can view more listings and save them (login prompt?))
            return { type: "property_search", properties: propertiesList };

        case "real_estate":
            const realEstateResponse = await answerRealEstateQuestions(userQuery)
            return { type: "text", content: realEstateResponse.response };

        case "clarification":

            // figure out what needs to happen here... respond to the user with a string to clarify and capture that in the front end and feed it back into the function with the new user query and maybe the intent if we want to skip re-classifying intent with the new query since we know its just a clarification of the previous intent
            return { type: "text", content: `this is a response for clarification intent with confidence: ${intent.confidence}` };

        case "refinement":
            // take past property array context, pass it all in to filter, return property array back based on that refinement from the user query 
            if (context?.searchState?.originalPropertyResults != null) {
                const allProperties = context?.searchState?.originalPropertyResults;
                
                // take all the current properties, send it into LLM with the user query and instructions to refine the list based on the user query and return back a refined list of properties based on that

                // function here with parameters, user query, and property list context --> that function has the system prompt for it and calls the LLM and returns the refined list of properties based on that user query refinement request
                // const filteredProperties --> have a different return type. PropertyArray probably
                const filteredPropertyIdsResponse = await refinePropertySearch(userQuery, stripMediaData(allProperties)); 
                
                return { type: "text", propertyIds: filteredPropertyIdsResponse.ids };
            } else {
                return { type: "text", content: "Error: The propertyList is blank" };
            }

        case "specific_property":

            // Sanity check 
            if (context?.selectedProperties != null) {
                // take singular property context, pass it all in to property LLM, return answers as a string
                const specificProperties = context?.selectedProperties;
                
                // call function, pass these things --> that function has the system prompt for it and calls the LLM and returns the response for that specific property question
                const response = await answerSpecializedPropertyQuestions(userQuery, stripMediaData(specificProperties));

                // type is a simple response but context update includes the intent and the selected properties that match the user query for the specific property question so that it can be used for follow up questions about that same property without having to identify the property again
                return { type: "text", content: response.response, contextUpdate: { intent: intent, selectedProperties: specificProperties } };

            } else if (context?.searchState?.originalPropertyResults != null) {
                // search for property out of the given list of properties using the property address street name 
                const propertyAddressContextList = mapPropertyAddressData(context.searchState?.originalPropertyResults);

                const identifiedPropertyResponse = await identifySpecializedProperty(userQuery, propertyAddressContextList);

                // call function, pass these things --> that function has the system prompt for it and calls the LLM and returns the response for that specific property question
                const specificProperties = context.searchState?.originalPropertyResults.filter(property => identifiedPropertyResponse.ids.includes(property.id));
                const response = await answerSpecializedPropertyQuestions(userQuery, stripMediaData(specificProperties));

                // type is a simple response but context update includes the intent and the selected properties that match the user query for the specific property question so that it can be used for follow up questions about that same property without having to identify the property again
                return { type: "text", content: response.response, contextUpdate: { intent: intent, selectedProperties: specificProperties } };

            } 
            else {
                return { type: "text", content: "Error: no specific property selected" };
            }

        case "other":
            return { type: "text", content: `this is a response for other intent with confidence: ${intent.confidence}` };
        
        default:
            return { type: "text", content: `could not classify intent with confidence: ${intent.confidence}` };
    }
}

/* Helper functions for search and filtering*/
function hasSearchCriteriaChanged(activeFilter: ActiveSearchCriteria | undefined, newBaseFilters: FilterItem[]): boolean {
    if (!activeFilter) return true;

    const newCriteria = deriveFilters(newBaseFilters);

    return (
        newCriteria.city !== activeFilter.city ||
        newCriteria.minPrice !== activeFilter.minPrice ||
        newCriteria.maxPrice !== activeFilter.maxPrice
    );
}

function deriveFilters(filters: FilterItem[]) {
    const city = getFilter(filters, "City")?.value;
    const minPrice = getFilter(filters, "ListPrice", "ge")?.value;
    const maxPrice = getFilter(filters, "ListPrice", "le")?.value;

    return { city, minPrice, maxPrice };
}

function getFilter(filters: FilterItem[], key: string, operator?: PropertyOperator): FilterItem | undefined {
    return filters.find(filter => filter.key === key && (operator ? filter.operator === operator : true));
}




