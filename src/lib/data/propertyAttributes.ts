
/* Attributes in MLS data */

export const MLS_ATTRIBUTES = [
    {
        name: "City",
        type: "string",
        synonyms: ["city", "town", "location", "area", "neighborhood", "in", "near", "around"]
    },
    {
        name: "BedroomsTotal",
        type: "number",
        synonyms: ["bedrooms", "bedroom", "bdrms", "bdrm"]
    },
    {
        name: "BathroomsTotalInteger",
        type: "number",
        synonyms: ["bathrooms", "bathroom", "baths", " bath", "washroom", "washrooms", "restroom", "restrooms"]
    },
    {
        name: "BuildingAreaTotal",
        type: "number",
        synonyms: ["square footage", "sq ft", "sqft"]
    }

    // rest of attributes to be added



]