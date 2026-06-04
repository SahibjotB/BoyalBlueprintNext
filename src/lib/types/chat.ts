// Any mapping for dataTypes can be exported types here. Makes it easier to reference anywhere

import { Property } from "./property";

export type Intent = 
| "property_search"
| "real_estate"
| "clarification"
| "refinement"
| "specific_property"
| "other";

/* Types for LLM Service to return */
export type IntentResult = {
    intent: Intent;
    confidence?: number;
};

export type BaseResult = {
    response: string
}

export type PropertyRefinementResult = {
    ids: string[];
}

export type PropertyIdentifiedResult = {
    ids: string[];
}

/* Types for chat service to return to front end with consistent format for handling in the front end and rendering */
export type ChatResult = 
|   {
        type: "clarification";
        content: string[];
        contextUpdate?: Partial<ChatContext>;
    }
|   {
        type: "text";
        content: string;
        contextUpdate?: Partial<ChatContext>;
    }
|   {
        type: "property_search";
        properties: Property[];
    };


export type PropertyOperator = 
    | "eq"
    | "gt"
    | "ge"
    | "lt"
    | "le";

export type FilterItem = {
    key: string;
    value: string | number | boolean;
    operator: PropertyOperator;
}

export type ActiveFilter = {
    key: string;
    value: string | number | boolean;
}

export type ExtractLLMResult = {
    filters: FilterItem[];
    activeFilters: ActiveFilter[];
    needsClarification: boolean;
    missingFields: string[];
}

export type FilterMap = Record<string, FilterItem[]>;

export type ExtractResult = {
    filters: FilterItem[];
    needsClarification: boolean;
    missingFields: string[];
};

export type ChatHistoryItem = {
    sender: string;
    message: string;
    intent: Intent;
};

export type ActiveSearchCriteria = {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
};

export type SearchState = {
    // criteria used to generate the original MLS search
    activeSearchCriteria?: ActiveSearchCriteria;

    // raw MLS results before any AI refinement
    originalPropertyResults?: Property[];

    // current working set after refinements
    refinedPropertyResults?: Property[];

    // Human-readable refinement history
    activeFilters: string[];

}

export type ChatContext = {
    intent?: IntentResult;

    selectedProperties?: Property[];

    missingFields?: string[];

    searchState?: SearchState;

};