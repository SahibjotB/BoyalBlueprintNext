import { Property } from "@/lib/types/property";
import { SemanticEvaluation } from "@/lib/types/search";
import { chunkArray } from "@/lib/utils/arrayUtils";

const BATCH_SIZE = 50;

export async function evaluatePropertiesForFilter(filterKey: string, filterDescription: string, properties: Property[]): Promise<SemanticEvaluation[]> {
    const batches = chunkArray(properties, BATCH_SIZE);

    const results: SemanticEvaluation[] = [];

    for (const batch of batches) {
        const batchResults = await evaluateBatch(filterKey, filterDescription, batch);
        results.push(...batchResults);
    }

    return results;
}

// LLM Evaluation function for a batch. Evaluate against properties and return some result (of the batch)
async function evaluateBatch(filterKey: string, filterDescription: string, properties: Property[]): Promise<SemanticEvaluation[]> {
    

    return [];
}