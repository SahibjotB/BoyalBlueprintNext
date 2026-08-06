
/* Specialize this service to use for expertise on refining the current property seach using an LLM */

import { PropertyRefinementResult } from "@/lib/types/chat";
import { generateOutput } from "./llmService";
import { PropertyWithoutMedia } from "@/lib/types/property";

export async function refinePropertySearch (userQuery: string, propertyList: PropertyWithoutMedia[]): Promise<PropertyRefinementResult> {

    // Instructions for how the AI should take the user query and work with it
    const systemPrompt = 
    `You are a real estate property filtering engine.

    Your task is to filter a list of properties based on a user's refinement request.

    You will be given:
    1. A user query describing filtering criteria
    2. A list of properties in JSON format

    RULES:
    - ONLY use properties from the provided list
    - DO NOT invent or modify properties
    - Each property has a unique "id"
    - Return ONLY matching property IDs
    - If no matches, return an empty array
    - Do NOT include explanations or extra text

    You must evaluate properties based on any of the property attributes that are relevant to the user query, such as location, price, number of bedrooms, etc. The user query may include various types of refinement criteria, such as "Show me properties in downtown under $500k with at least 2 bedrooms". You need to parse the user query, identify the filtering criteria, and apply those criteria to the list of properties provided in the context to determine which properties match the user's refinement request.
    ` 

    // Define the expected schema for the LLM response to ensure we get structured data back that we can work with

    // Schema to return propertyIDs that match the refinement query from the user based on the list of properties sent in as context with the user query. Return an array of property IDs that match the refinement criteria specified in the user query. The LLM should analyze the user query, apply the refinement criteria to the list of properties provided in the context, and return a list of property IDs that meet those criteria.
    const refinedPropertySchema = {
        name: "refined_properties_response",
        schema: {
            type: "object",
            properties: {
                ids: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            required: ["ids"],
            additionalProperties: false
        }
    }
    
    // call llm service with system prompt and user query, specify structured output with schema for expected return format
    const userPrompt = `User refinement request: ${userQuery} PROPERTIES: ${JSON.stringify(propertyList)}`;

    const response = await generateOutput<PropertyRefinementResult>({ systemPrompt, userPrompt: userPrompt, schema: refinedPropertySchema, caller: "propertyRefinementService" });
    return response;
}