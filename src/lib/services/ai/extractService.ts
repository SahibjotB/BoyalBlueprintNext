/* Call this with user query to build system prompt to identify intent */

import { ExtractResult} from "@/lib/types/chat";
import { generateOutput } from "./llmService";
import { findRelevantAttributes } from "@/lib/utils/attributeSelector";

export async function extractPropertyValues(userQuery:string): Promise<ExtractResult> {

    // relevant attributes broken down with basic mapping (add that in system prompt)
    const relevantAttributes = findRelevantAttributes(userQuery);
    
    // map to system prompt format
    const relevantAttributesContext =  relevantAttributes.map(attr => `
        - ${attr.name}: (${attr.type})
        synonyms: ${attr.synonyms.join(", ")}
        `).join("\n");

    // Instructions for how the AI should take the user query and work with it
    const systemPrompt = `    
        You are a real estate search query parser who needs to extract structured filters from a user query.
        Available attributes to extract:
        ${relevantAttributesContext}

        Rules:
        - Use ONLY these attributes
        - Convert natural language into structured filters
        - Boolean fields is true/false
        - Numbers must be numbers 
        - Handle price:
         - "under X" -> ListPriceMax
         - "over X" -> ListPriceMin

        If City is missing, mark needsClarification = true and add "city" to missingFields array
    `;

    // Define the expected schema for the LLM response to ensure we get structured data back that we can work with
    const extractResultSchema = {
        name: "extract_classification",
        schema: {
            type: "object",
            properties: {
                filters: {
                    type: "object",
                    additionalProperties: true // allow for dynamic keys based on attributes with flexible values
                },
                needsClarification: {
                    type: "boolean"
                },
                missingFields: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            required: ["filters", "needsClarification", "missingFields"],
            additionalProperties: false
        }
    }
    
    // call llm service with system prompt and user query, specify structured output with schema for expected return format
    const response = await generateOutput<ExtractResult>({ systemPrompt, userPrompt: userQuery, schema: extractResultSchema });
    return response;
}
