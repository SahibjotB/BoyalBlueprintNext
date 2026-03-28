// Any mapping for dataTypes can be exported types here. Makes it easier to reference anywhere

export type Intent = 
| "property_search"
| "real_estate"
| "other";

export type IntentResult = {
    intent: Intent;
    confidence: number;
};

export type ChatResult = 
|   {
        type: "test";
        message: string;
    }
|   {
        type: "test2";
        message: number;
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

export type FilterMap = Record<string, {value: string | number | boolean; operator: PropertyOperator}>;

export type ExtractResult = {
    filters: FilterMap;
    needsClarification: boolean;
    missingFields: string[];
}




