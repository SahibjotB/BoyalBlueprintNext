import { Filter } from "lucide-react";
import { ChatResult, Intent, IntentResult, ChatContext, ActiveSearchCriteria, FilterItem, PropertyOperator, ActiveFilter } from "../types/chat";
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
    const intent = context?.intent ?? await identifyIntent(userQuery, context?.firstTimeRunFlag);

    // 2) Act upon the identified intent with different behaviors for chat returns
    switch (intent.intent) {
        // Return with ChatResult type makes it easy to handle what comes back in the front end and ensures we have a consistent format for all responses
        case "property_search":
            let propertiesList: Property[] = [];

            // calls to extraction service 
            const propertyFilterExtractionResult = await extractPropertyValues(userQuery);
            console.log(propertyFilterExtractionResult);

            // Build search criteria and take into account any previous mentions of that criteria, merge those together
            const extractedRequiredSearchCriteria = buildSearchCriteria(propertyFilterExtractionResult.filters);

            const mergedRequiredSearchCriteria: ActiveSearchCriteria = {
                ...context?.searchState?.activeSearchCriteria,
                ...extractedRequiredSearchCriteria
            };

            // check extracted missing fields against the merged extracted fields and previous context fields. removing any that are present already
            let missingFields = [...propertyFilterExtractionResult.missingFields];
            
            missingFields = missingFields.filter(field => {
                switch (field) {
                    case "City":
                        return !mergedRequiredSearchCriteria.city;
                    case "ListPrice":
                        return (mergedRequiredSearchCriteria.minPrice == null && mergedRequiredSearchCriteria.maxPrice == null);
                    default:
                        return true; // keep fields that are not recognized for now 
                }
            });

            // Get active filters (non mls.. used for LLM)
            const activeFilters = propertyFilterExtractionResult.activeFilters;

            // merge active filters to use them from previous context 
            let previousActiveFilters = context?.searchState?.activeFilters;
            let mergedActiveFilters = mergeActiveFilters(previousActiveFilters ?? [], activeFilters);

            // Check against the missing fields that are already satisifed by the past context... Make sure there isn't still fields missing that are required (if length > 0)
            if (missingFields.length > 0) {
                // return with clarification type and content to show to the user and also update the context with what fields are missing so that when the user responds with the clarification we have that context available to know what they are clarifying about 
                return { type: "clarification", missingFields: propertyFilterExtractionResult.missingFields, contextUpdate: { intent: intent, pendingClarification: undefined, searchState: { ...context?.searchState, activeSearchCriteria: mergedRequiredSearchCriteria, activeFilters: mergedActiveFilters } } };
            }   
            
            /* BASE MLS Filtering logic: get values here and then build OData query string to send to the property API to get results back based on those filters. */
            const MLSBaseFilter = buildMLSBaseFilters(mergedRequiredSearchCriteria);
            const odataQueryString = await buildODataQuery(MLSBaseFilter);

            console.log("Generated OData query string:", odataQueryString);

            // fix query criteria to use
            const improvedUserQuery = `
            User Query: ${userQuery}

            Active Filters to refine with: 
            ${buildFilterContext(mergedActiveFilters)}
            `;

            /* MLS Property search. Update originalPropertyList */
            let refinedPropertyResults = context?.searchState?.refinedPropertyResults;

            // Either search context has changed or there is no existing property list so query MLS for new list or else just use the one from context given no change
            if(hasSearchCriteriaChanged(context?.searchState?.activeSearchCriteria, MLSBaseFilter) || context?.searchState?.originalPropertyResults == null || context?.searchState?.originalPropertyResults.length == 0) {
                propertiesList = await fetchMLSProperties(odataQueryString, 5);
                refinedPropertyResults = undefined;

                // clear previous active filters and use only current ones
                previousActiveFilters = undefined;
                mergedActiveFilters = activeFilters;

                console.log("Initial Run of property search");

            } else {
                propertiesList = context.searchState.originalPropertyResults;
            }

            // if activeFilters have values we have to refine this further with these filters so just send propertyList and search query to the refinement function
            if (activeFilters.length > 0) {
                let refinedPropertiesList: Property[];
                // if there is something to refine.. if there is an existing list, refine that list first.. if there isn't a list or its the first search with extra criteria refine the original
                if (refinedPropertyResults != null && refinedPropertyResults.length > 0) {
                    // refining off the current user query since we already accounted for the other filters in refinement
                    const filteredPropertyIdsResponse = await refinePropertySearch(userQuery, stripMediaData(refinedPropertyResults)); 
                    refinedPropertiesList = refinedPropertyResults.filter(property => filteredPropertyIdsResponse.ids.includes(property.id));

                    // if refined gives 0... refine the original property list
                    if (refinedPropertiesList.length == 0 && context?.searchState?.originalPropertyResults != null) {
                        // run the refinement again with the original results to narrow that down
                        const filteredPropertyIdsResponse = await refinePropertySearch(userQuery, stripMediaData(propertiesList)); 
                        refinedPropertiesList = propertiesList.filter(property => filteredPropertyIdsResponse.ids.includes(property.id));
                    }
                } else {
                    // filter off regular property list without ever using the refinement list (isn't one yet). // user query for the first refinement keeps track of all filters (since its base refinement)
                    const filteredPropertyIdsResponse = await refinePropertySearch(improvedUserQuery, stripMediaData(propertiesList)); 
                    refinedPropertiesList = propertiesList.filter(property => filteredPropertyIdsResponse.ids.includes(property.id));
                    console.log("Initial refinement off propertylist initial");
                }
                // if there is refinement. return main list as the refined one and store the original and refined 
                return { type: "property_search", properties: refinedPropertiesList, contextUpdate : {intent: intent, pendingClarification: undefined, searchState: {originalPropertyResults: propertiesList, refinedPropertyResults: refinedPropertiesList, activeSearchCriteria: mergedRequiredSearchCriteria, activeFilters: mergedActiveFilters}}};
            }

            // Return array of Property objects (nothing refined)
            return { type: "property_search", properties: propertiesList, contextUpdate : {intent: intent, pendingClarification: undefined, searchState: {originalPropertyResults: propertiesList, activeSearchCriteria: mergedRequiredSearchCriteria, activeFilters: mergedActiveFilters}}};

        case "real_estate":
            const realEstateResponse = await answerRealEstateQuestions(userQuery)
            return { type: "text", content: realEstateResponse.response, contextUpdate: { pendingClarification: undefined } };

        case "specific_property": 
            // check if there's a property list to search against
            if (!context?.searchState?.originalPropertyResults || context.searchState.originalPropertyResults.length == 0) {
                return { type: "text", content: "No property search results to reference for your question", contextUpdate: { pendingClarification: undefined }};
            }

            // check to see if its clarifying from previous context
            if (context?.pendingClarification?.type == "property_selection") {
                userQuery = `${context.pendingClarification.originalQuestion} ${userQuery}`;
            }
        
            // check to see if there is new address context
            // search for property out of the given list of properties using the property address street name 
            const propertyAddressContextList = mapPropertyAddressData(context.searchState?.originalPropertyResults);
            const identifiedPropertyResponse = await identifySpecializedProperty(userQuery, propertyAddressContextList);
            const identifiedProperties = context.searchState.originalPropertyResults.filter(property => identifiedPropertyResponse.ids.includes(property.id));

            let targetProperties: Property[] = [];
            
            // check to see if this new one is a comparison to a previous context property question (exists in selected properties)

            if (identifiedProperties.length > 0 && context?.selectedProperties?.length && isComparisonBased(userQuery)) {
                // merge them together
                const merged = new Map<string, Property>();

                // get all the properties from selectedProperties and add to map (this avoids duplication)
                for (const property of context.selectedProperties) {
                    merged.set(property.id, property);
                }
                
                // same for all properties that were passed in from query extraction finding
                for (const property of identifiedProperties) {
                    merged.set(property.id, property);
                }

                // convert this into target array with just the values to answer the question about
                targetProperties = Array.from(merged.values());
            // if it finds properties directly from the query, just use those (replacing the previous since its not comparison based)
            } else if (identifiedProperties.length > 0) {
                targetProperties = identifiedProperties
            // if there isn't any properties in this user query but some in past context then use that to answer questions
            } else if (context?.selectedProperties?.length && identifiedProperties.length === 0 && !isComparisonBased(userQuery)) {
                targetProperties = context.selectedProperties;
            } else {
                return { type: "text", content: "Couldn't find the property you're asking about from the list. Please try again",  contextUpdate: { pendingClarification: undefined }};      
            }

            // if its ambiguious since there is previously multiple properties in history, then ask user which one
        
            // if there's multiple properties in the identified Target list but the current query doesn't identify any of them. we have to figure out how to answer the question regarding those
            if (targetProperties.length > 1 && identifiedProperties.length === 0) {
                const addresses = targetProperties.map(p => p.address.unparsedAddress).join(" or ");

                // question the user with a response
                return {type: "text", content: `which property are you referring to: ${addresses}?`, contextUpdate: {intent, selectedProperties: targetProperties, pendingClarification: { type: "property_selection", originalQuestion: userQuery }}};
            }

            // call function, pass these things --> that function has the system prompt for it and calls the LLM and returns the response for that specific property question
            const response = await answerSpecializedPropertyQuestions(userQuery, stripMediaData(targetProperties));

            // type is a simple response but context update includes the intent and the selected properties that match the user query for the specific property question so that it can be used for follow up questions about that same property without having to identify the property again
            return { type: "text", content: response.response, contextUpdate: { intent: intent, selectedProperties: targetProperties, pendingClarification: undefined } };

        case "other":
            return { type: "text", content: `this is a response for other intent with confidence: ${intent.confidence}`, contextUpdate: { pendingClarification: undefined } };
        
        default:
            return { type: "text", content: `could not classify intent with confidence: ${intent.confidence}`, contextUpdate: { pendingClarification: undefined } };
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

// convert extracted criteria into active so we can combine and ensure we have required
function buildSearchCriteria(filters: FilterItem[]): ActiveSearchCriteria {
    const criteria: ActiveSearchCriteria = {};

    for (const filter of filters) {
        if (filter.key === "City") {
            criteria.city = filter.value as string;
        } else if (filter.key === "ListPrice") {
            if (filter.operator === "ge") {
                criteria.minPrice = filter.value as number;
            } else if (filter.operator === "le") {
                criteria.maxPrice = filter.value as number;
            }
        }
    }
    return criteria;
}

// build that into the MLSBaseFilters to get OdataQuery built
function buildMLSBaseFilters(criteria: ActiveSearchCriteria): FilterItem[] {
    const filters: FilterItem[] = [];
    if (criteria.city) {
        filters.push({ key: "City", value: criteria.city, operator: "eq" });
    }
    if (criteria.minPrice !== undefined) {
        filters.push({ key: "ListPrice", value: criteria.minPrice, operator: "ge" });
    }
    if (criteria.maxPrice !== undefined) {
        filters.push({ key: "ListPrice", value: criteria.maxPrice, operator: "le" });
    }
    return filters;
}

// check if user is asking to compare new properties to previous ones in context
function isComparisonBased (userQuery: string): boolean {
    const query = userQuery.toLowerCase();

    return [
        "compare",
        "compared to",
        "versus",
        "vs",
        "difference",
        "better",
        "worse",
        "which one",
        "which property",
        "how does",
    ].some(term => query.includes(term));
}

// merging active Filters (non MLS)
function mergeActiveFilters(existing: ActiveFilter[], currentQuery: ActiveFilter[]) {
    // to merge arrays of active filters (use map)

    const combineMap = new Map<string, ActiveFilter>();

    for (const filter of existing) {
        combineMap.set(filter.key, filter);
    }

    for (const filter of currentQuery) {
        combineMap.set(filter.key, filter);
    }
    
    // flatten this combined map that has all unique keys to get an array of activeFilters we originally had
    return Array.from(combineMap.values());
}

// fix activeFilters into better readable text input
function buildFilterContext(filters: ActiveFilter[]) {
    if (!filters || filters.length == 0) return "";

    return filters
        .map (filter => `-${filter.key}: ${JSON.stringify(filter.value)})`)
        .join("\n");
}