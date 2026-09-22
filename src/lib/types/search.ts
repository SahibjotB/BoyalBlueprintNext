import { ActiveFilter, ActiveSearchCriteria } from "./chat";
import { Property } from "./property";


export type SearchStatus = 
 | "processing"
 | "complete"
 | "cancelled"
 | "failed"

export type Search = {
    id: string;
    chatId: string;

    activeSeasrchCriteria?: ActiveSearchCriteria;
    activeFilters: ActiveFilter[];

    totalPropertyCount: number;
    evaluatedPropertyCount: number;
    matchedPropertyCount: number;

    nextLink: string | null;
    status: SearchStatus;

    targetResults: number;
    maxEvaluations: number;
    maxPages: number;
};

export type SearchPageResult = {
    properties: Property[];
    totalCount: number;
    nextLink: string | null;
};

export type SearchQueueMessage = {
    searchId: string;
}

export type SemanticEvaluation = {
    propertyId: string;
    filterKey: string;
    score: number;
    matches: boolean;
    evidence: string[];
    model: string;
}