
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
    },
    {
        name: "ApproximateAge",
        type: "number",
        synonyms: ["Age", "Built in", "Older than", "years"]
    },
    {
        name: "AttachedGarageExistance",
        type: "boolean",
        synonyms: ["Garage"]
    },
    {
        name: "BalconyType",
        type: "string",
        synonyms: ["Balcony"]
    },
    {
        name: "BasementDetails",
        type: "string",
        synonyms: ["Basement", "bsmt", "finished", "unfinished", "Separate Entrance"]
    },
    {
        name: "Cooling",
        type: "string",
        synonyms: ["cooling", "AC", "air"]
    },
    {
        name: "DirectionFaces",
        type: "string",
        synonyms: ["north", "east", "south", "west", "direction"]
    },
    {
        name: "ListPrice",
        type: "number",
        synonyms: ["price", "cost" , "$"]
    },
    {
        name: "LotDepth",
        type: "number",
        synonyms: ["lot"]
    },
    {
        name: "LotWidth",
        type: "number",
        synonyms: ["lot"]
    },
    {
        name: "ParkingSpaces",
        type: "number",
        synonyms: ["parking", "driveway", "car"]
    },
    {
        name: "StreetName",
        type: "string",
        synonyms: ["street", "drive", "court", "way", "trail", "grove", "crescent", "court", "ln", "lane", "ct", "avenue", "rd", "road", "parkway", "place"]
    },
    {
        name: "TaxAnnualAmount",
        type: "number",
        synonyms: ["tax"]
    }
    
    // rest of attributes to be added
    // add the attributes to be found then extracted, mapping what could be attributes based on the userinput
    // We can have core required ones as base
    // any additionals would be added
    // extraction prompt extracts the relevant values to Odata string--> gets properties

    // rest would be refined 

    // SOME OF THESE COULD BE NEEDED AS CORE SINCE 

    // Combine with whats core and send the combination of both
    // Somehow map it where some attributes can be that attribute "or" null given bad data 

]