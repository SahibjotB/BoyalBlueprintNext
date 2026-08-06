/* Call this with user query to build system prompt to identify intent */

import { ExtractLLMResult, ExtractResult, FilterItem, FilterMap} from "@/lib/types/chat";
import { generateOutput } from "./llmService";
import { findRelevantAttributes } from "@/lib/utils/attributeSelector";
import { MLS_ATTRIBUTES } from "@/lib/data/propertyAttributes";

export async function extractPropertyValues(userQuery:string): Promise<ExtractResult> {
    
    // map to system prompt format
    const relevantAttributesContext =  MLS_ATTRIBUTES

    // Instructions for how the AI should take the user query and work with it
    const systemPrompt = `    
        You are a real estate search query parser who needs to extract structured filters from a user query.

        You must extract two types of data with different rule sets:

        1) MLS Filters (used for database search)
        - ONLY use MLS attributes from the provided list: ${relevantAttributesContext}
        - THIS Currently Only INCLUDES: ListPrice, City. EVERYTHING ELSE is an ACTIVE FILTER 
          - City can only be 1 word: if it includes directions like {Brampton}{East}. Only use the root city name like {Brampton}.
          - There are multiple cities that are likely to come up as reference: {Toronto, Brampton, Markham, Ajax, Pickering, Hamilton, Oshawa, Milton, Oakville, Caledon, Missisauga, Richmond Hill, Vaughan}
        - Convert natural language into structured filters
        - Boolean fields is true/false
        - Numbers must be numbers (convert common formats like "500k" to 500000)

        - A single attribute may appear multiple times if needed with different operators
        - When extracting filters, always include an operator:
            - "more than, "over", "above", "atleast", "minimum" or similar means "ge"
            - "less than", "under", "below", "maximum" or similar means "le"
            - "equal to", "exactly", "is" or similar means "eq"
            - otherwise default to eq if its not clear 
        - Add these to the filters array in the response with the format { key: string, value: string | number | boolean, operator: "eq" | "gt" | "ge" | "lt" | "le" }


        2) ACTIVE FILTERS (used for conversation state management and refinement)
        - Thse are user preferences not tied to MLS Fields so anything outside of city and price
        - Examples:
          - "modern kitchen"
          - "quiet street" 
          - "natural lighting"
          - "open concept"
          - "large square footage. greater than 2000 sqft"
          - "driveway, parking spaces"
          - "backyard, outdoor space"
          - "proximity to amenities like parks, schools, shopping"
          - "More than 4 bedrooms"
        - Add any of these active filters that are mentioned in the user query to the activeFilters array in the response as free-form text. Aim to categorize the property of them as the key and the user preference as the value but if its not clear just add the whole phrase as the value and use a generic key like "userPreference" or "feature". If there is ranges like "square footage greater than 2000 sqft" you can add that as an active filter with key "squareFootage" and value "greater than 2000 sqft" or something similar. The goal is to capture user preferences that may not be directly tied to MLS fields but are still important for understanding what the user is looking for in a property. If its detached home for example, categorize the key as "houseType" or something fitting, that way if its condo or apartment later we can differentiate.

        Rules for both types of data:
        - Do not guess values
        - Do not infer missing numbers
        - Use only provided MLS attributes for filters
        - Active filters can be free-form
        - Extract everything relevant
        - Multiple filters per attribute are allowed (ranges)

            
        If City is missing, mark needsClarification = true and add "City" to missingFields array otherwise needsClarification should be false and missingFields should be empty array if all needed fields are there.
        If ListPrice is missing, mark needsClarification = true and add "ListPrice" to missingFields array otherwise needsClarification should be false and missingFields should be empty array if all needed fields are there.
    `;

    // Define the expected schema for the LLM response to ensure we get structured data back that we can work with
    const extractResultSchema = {
        name: "extract_classification",
        schema: {
            type: "object",
            properties: {
                filters: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            key: { type: "string" },
                            value: {
                                anyOf: [
                                    { type: "string" },
                                    { type: "number" },
                                    { type: "boolean" }
                                ]
                            },
                            operator: {
                                type: "string",
                                enum: ["eq", "gt", "ge", "lt", "le"]
                            }
                        },
                        required: ["key", "value", "operator"],
                        additionalProperties: false
                    }
                },
                activeFilters: {
                    type: "array",
                    items: { 
                        type: "object",
                        properties: {
                            key : { type: "string" },
                            value : {
                                anyOf: [
                                    { type: "string" },
                                    { type: "number" },
                                    { type: "boolean" }
                                ]
                            }
                        },
                        required: ["key", "value"],
                        additionalProperties: false
                    }
                },
                needsClarification: { type: "boolean" },
                missingFields: {
                    type: "array",
                    items: { type: "string" }
                }
            },
            required: ["filters", "activeFilters", "needsClarification", "missingFields"],
            additionalProperties: false
        }
    }
    
    // call llm service with system prompt and user query, specify structured output with schema for expected return format
    const LLMResponse = await generateOutput<ExtractLLMResult>({ systemPrompt, userPrompt: userQuery, schema: extractResultSchema, caller: "extractService" });
    const normalizedFilters = normalizeFilters(LLMResponse.filters);
    
    const extractResponse = {
        filters: normalizedFilters,
        activeFilters: LLMResponse.activeFilters,
        needsClarification: LLMResponse.needsClarification,
        missingFields: LLMResponse.missingFields
    }

    return extractResponse;
}

function normalizeFilters(filters: FilterItem[]): FilterItem[] {

    return filters.map((item)=> {
         if (item.key == "City"){
            item.value = (item.value as string).charAt(0).toUpperCase() + (item.value as string).slice(1).toLowerCase();
        }
        return item;
    });

}


