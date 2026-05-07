/* Attribute relevance from user query to property attributes to shrink attr list for LLM input */

import { MLS_ATTRIBUTES } from "../data/propertyAttributes";

export function findRelevantAttributes(userQuery: string) {
    const userInput = userQuery.toLowerCase();

    return MLS_ATTRIBUTES.filter(attr =>
        attr.synonyms.some(syn => userInput.includes(syn))
    );
}
