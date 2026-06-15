
/* Converts user query JSON that LLM detects to structured filters for Property API */

import { FilterItem } from "../types/chat";

// Core conversion of JSON return from user to Odata filter

// returns string odata query... after we get that.. send that to propertyService that talks to MLS and returns array of PropertyType objects 
// Build that off of attributes and add as a type to use
// Clarfication routes of whats missing
// Prompting more info 

export function buildODataQuery(filters: FilterItem[]) {
    const odataQueryString: string[] = [];
    // loop through the values and push key value pair with operation condition
    
    for (const filter of filters) {
        const { key, value, operator } = filter;
        
        if (value === undefined || value === null) continue;

        if (typeof value === "string") {
            odataQueryString.push(`${key} eq '${value}'`);
        } else if (typeof value === "number") {
            odataQueryString.push(`${key} ${operator} ${value}`);
        } else if (typeof value === "boolean") {
            odataQueryString.push(`${key} eq ${value}`);
        }
    }

    return encodeURIComponent(odataQueryString.join(" and "));
}
