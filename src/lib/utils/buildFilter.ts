
/* Converts user query JSON that LLM detects to structured filters for Property API */

import { FilterMap } from "../types/chat";

// Core conversion of JSON return from user to Odata filter

// returns string odata query... after we get that.. send that to propertyService that talks to MLS and returns array of PropertyType objects 
// Build that off of attributes and add as a type to use
// Clarfication routes of whats missing
// Prompting more info 

export function buildODataQuery(filters: FilterMap) {
    const odataQueryString: string[] = [];

    // loop through the values and push key value pair with operation condition
    for (const [key, value] of Object.entries(filters)) {
        console.log(key, value);
        if (value.value === undefined) continue;

        // add on the conditionals with fall back helpers (this combines the fallback with default with an or and contains clause)
        if (key === "BedroomsTotal" && typeof value.value === "number") {
            // get the variations of bedroom with helper function
            const variants = generateBedroomFallback(value.value);

            const fallbackQuery = variants.map(
                variant => `contains(PublicRemarks, '${variant}')`
            );
            console.log(fallbackQuery);
            console.log(odataQueryString);
            odataQueryString.push(`(BedroomsTotal ${value.operator} ${value.value} or ${fallbackQuery.join(" or ")})`);
            continue;
        } 

        if (key === "BathroomsTotalInteger" && typeof value.value === "number") {
            // get the variations of washroom with helper function
            const variants = generateWashroomFallback(value.value);

            const fallbackQuery = variants.map(
                variant => `contains(PublicRemarks, '${variant}')`
            );
            odataQueryString.push(`(BathroomsTotalInteger ${value.operator}  ${value.value} or ${fallbackQuery.join(" or ")})`);
            continue;
        } 

        if (key === "BuildingAreaTotal" && typeof value.value === "number") {
            // get the variations of sqft
            const variants = generateSqftFallback(value.value);

            const fallbackQuery = variants.map(
                variant => `contains(PublicRemarks, '${variant}')`
            );
            odataQueryString.push(`( BuildingAreaTotal ${value.operator}  ${value.value} or ${fallbackQuery.join(" or ")})`);
            continue;
        } 

        // regular defaults (for ones that don't hit the fall back variations)
        if (typeof value.value === "string") {
            odataQueryString.push(`${key} eq '${value.value}'`);
        } else if (typeof value.value === "number") {
            odataQueryString.push(`${key} ${value.operator}  ${value.value}`);
        } else if (typeof value.value === "boolean") {
            odataQueryString.push(`${key} eq ${value.value}`);
        }
    }
    return encodeURIComponent(odataQueryString.join(" and "));
}

// Fall back helpers
const numbWords: Record<number, string> = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six"
};

function generateBedroomFallback(value: number): string[] {

    const word = numbWords[value];

    return [
        `${value} bed`,
        `${value} beds`,
        `${value} bedroom`,
        `${value} bedrooms`,
        `${value} bdrm`,
        `${value} bdrms`,
        
        // make sure word isn't undefined (say its randomly 7 bedrooms out of our mapping)
        
        // this does a conditional check for undefined
        word ? `${word} bed` : "",
        word ? `${word} beds` : "",
        word ? `${word} bedroom` : "",
        word ? `${word} bedrooms` : "",
        word ? `${word} bdrm` : "",
        word ? `${word} bdrms` : "",
    ].filter(Boolean);
}

function generateWashroomFallback(value: number): string[] {
    
    const word = numbWords[value];

    return [
        `${value} bath`,
        `${value} bathroom`,
        `${value} bathrooms`,
        `${value} washroom`,
        `${value} washrooms`,
        // make sure word isn't undefined (say its randomly 7 washrooms out of our mapping)
        
        // this does a conditional check for undefined
        word ? `${word} bath` : "",
        word ? `${word} bathroom` : "",
        word ? `${word} bathrooms` : "",
        word ? `${word} washroom` : "",
        word ? `${word} washrooms` : "",
    ].filter(Boolean);
}

function generateSqftFallback(value: number): string[] {
    return [
        `${value} sqft`,
        `${value} sq ft`,
        `${value} square feet`,
        `${value} Sqft`
    ].filter(Boolean);
}