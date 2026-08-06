
/* Specialize this service to use for expertise on real estate questions */

import { PropertyIdentifiedResult } from "@/lib/types/chat";
import { generateOutput } from "./llmService";
import { PropertyAddress } from "@/lib/types/property";

export async function identifySpecializedProperty (userQuery: string, propertyAddressContextList: PropertyAddress[]): Promise<PropertyIdentifiedResult> {

    // Instructions for how the AI should take the user query and work with it
    const systemPrompt = 
    `You are helping to identify which property/properties a user is referring to. Add the propertyIDs to the response array. Available properties: %${JSON.stringify(propertyAddressContextList)}%` 

    // Return an array of property IDs that match the user query. The LLM should analyze the user query, compare it to the list of property addresses provided in the context, and return a list of property IDs that are likely being referred to in the user query.
    const identifiedSpecializedPropertiesSchema = {
        name: "specialized_properties_response",
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
    const response = await generateOutput<PropertyIdentifiedResult>({ systemPrompt, userPrompt: userQuery, schema: identifiedSpecializedPropertiesSchema, caller: "specializedPropertyIdentifierService" });
    return response;
}