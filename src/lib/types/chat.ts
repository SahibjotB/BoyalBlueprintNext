// Any mapping for dataTypes can be exported types here. Makes it easier to reference anywhere

import { Property } from "./property";

export type Intent = 
| "property_search"
| "real_estate"
| "other";

export type IntentResult = {
    intent: Intent;
    confidence: number;
};

export type BaseResult = {
    response: string
}

export type ChatResult = 
|   {
        type: "baseString";
        message: string;
    }
|   {
        type: "propertyList";
        message: Property[];
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




