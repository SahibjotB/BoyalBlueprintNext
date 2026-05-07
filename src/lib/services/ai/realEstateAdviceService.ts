
/* Specialize this service to use for expertise on real estate questions */

import { BaseResult } from "@/lib/types/chat";
import { generateOutput } from "./llmService";

export async function answerRealEstateQuestions (userQuery: string): Promise<BaseResult> {

    // Instructions for how the AI should take the user query and work with it
    const systemPrompt = 
    `You are an expert on real estate, helping answer questions for new home buyers, explaining things in simple terms on the buying process, finances, mortgages and anything real estate relevant.` 

    // Define the expected schema for the LLM response to ensure we get structured data back that we can work with
    const baseResponseSchema = {
        name: "base_response",
        schema: {
            type: "object",
            properties: {
                response: {
                    type: "string"
                }
            },
            required: ["response"],
            additionalProperties: false
        }
    }
    
    // call llm service with system prompt and user query, specify structured output with schema for expected return format
    const response = await generateOutput<BaseResult>({ systemPrompt, userPrompt: userQuery, schema: baseResponseSchema });
    return response;
}