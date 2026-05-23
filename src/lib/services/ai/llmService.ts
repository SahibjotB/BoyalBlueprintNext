/* All calls to openAI here */

import { openAIClient } from "@/lib/openai";

// generic structured output function for any calls to LLM, takes in system and user prompts, and a schema for the expected return format to ensure we get structured data back that we can work with
type StructuredOutput<T> = {
    systemPrompt: string;
    userPrompt: string;
    schema: {
        name: string;
        schema: Record<string, unknown>;
    };
};

// This will pass in all prompting to go to OpenAI and a structured return model on the provided schema. Indicates the model to use as well. Function can tweak a lot of llm interactions
export async function generateOutput<T>({systemPrompt, userPrompt, schema} : StructuredOutput<T>): Promise<T> {
    try {
      
        const response = await openAIClient.responses.create({
            // can declare model selection and parameters here
            model: process.env.AZURE_OPENAI_MODEL,
            //temperature: 0,
            // sends in system and user queries
            input: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            // sends in the schema for structured output, using it to enforce structure on the output response 
            text: {
                format: {
                    type: "json_schema",
                    name: schema.name,
                    schema: schema.schema,
                } 
             
            } 
        });

        // extraction of the result raw and a fall back with nothing if ti fails 
        const raw = response.output_text || "{}";
        // checks to see if its legitimate json as expected otherwise has a few fall backs
        try {
            return JSON.parse(raw) as T;
        } catch (err)
        {
            console.error("LLM parse error with JSON:", err);
            return {} as T; // return empty object on parse failure
        }
    } catch (error) {
        console.error("LLM request error:", error);
        return {} as T; // return empty object on request failure
    }

}
