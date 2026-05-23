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

/* Types for chat service to return to front end with consistent format for handling in the front end and rendering */
export type ChatResult = 
|   {
        type: "refinement";
        propertyIds: string[];
    }
|   {
        type: "clarification";
        content: string[];
    }
|   {
        type: "text";
        content: string;
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
export type ExtractLLMResult = {
    filters: FilterItem[];
    needsClarification: boolean;
    missingFields: string[];
}

export type FilterMap = Record<string, {value: string | number | boolean; operator: PropertyOperator;}>;

export type ExtractResult = {
    filters: FilterMap;
    needsClarification: boolean;
    missingFields: string[];
}

export type ChatHistoryItem = {
    sender: string;
    response: string;
    intent: Intent;
}

export type ChatContext = {
  intent?: IntentResult;

  selectedProperty: Property;

  previousSearch?: ChatHistoryItem;

  missingFields?: string[];

  additionalContent?: string;

  propertyListContext?: Property[];

  firstTimeRunFlag?: boolean;

};