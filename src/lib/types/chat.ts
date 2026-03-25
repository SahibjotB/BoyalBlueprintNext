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