
// DB search functions for queue service

import { ActiveFilter, ActiveSearchCriteria } from "@/lib/types/chat";
import { Property } from "@/lib/types/property";
import { SemanticEvaluation } from "@/lib/types/search";

// create a new search record in DB with criteria and filters 
export async function createSearch(params: { 
    chatId: string; 
    activeSearchCriteria: ActiveSearchCriteria; 
    activeFilters: ActiveFilter[];
}) {
    // INSERT FUNCTION into searches

    // return search record
}

// get into the record based on ID and see how many properties were evaluated and how many matched
export async function updateSearchProcess(
    searchId: string, 
    data: { 
        totalPropertyCount?: number; 
        evaluatedPropertyCount?: number;
        matchedPropertyCount?: number;
        nextLink?: string | null;
        status?: string; 
    }
) {
    // UPDATE searches
}

//add the list of properties that were evaluated for the search
export async function addSearchPropertes(
    searchId: string,
    properties: Property[]
) {
    // INSERT Into search_properties
    // ON CONFLICT(search_id, property_id) 
    // DO UPDATE...
}

// get the full search record based on ID
export async function getSearch(searchId: string) {
    // SELECT search
}

// get the list of properties that were evaluated for the search
export async function getSearchProperties(searchId: string): Promise<Property[]> {
    // select property_data
    return [];
}


export async function getSemanticEvaluations(propertyIds: string[],filterKeys: string[]) {
    // SELECT from property_semantic_evaluations
}

export async function saveSemanticEvaluations(evaluations: SemanticEvaluation[]) {
    // INSERT on conflict... 
    // into property semantic evaluations
}
