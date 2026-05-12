import { Property, Room, Washroom } from "../types/property";


export async function fetchPropertiesWithRoomsMedia(odataQuery: string, resultCount: number): Promise<Property[]> {
    const webURL = process.env.MLS_API_ENDPOINT;
    const rawProperties = await fetchMLSProperties(webURL, odataQuery);

    const propertyIDs = rawProperties.map(p => p.id);

    const roomPropertyMap = await fetchMLSRoomProperties(webURL, propertyIDs)  

    const url = `${webURL}/odata/Media?$filter=ResourceRecordKey in (${propertyIDs.join(",")})`;

    const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    // somehow get a batch return on media images. Map. Loop through property objects and match
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MLS Property request failed- (${response.status}): ${errorText}`)
    }
    // get response json data
    const jsonData = await response.json();

    const mediaList = jsonData.value;

    // loop through the mediaList, map the ID and the largest image URL 

    const mediaMap = new Map<string, string[]>();

    for (const mediaItem of mediaList) {
        // update the array of image urls for the propertyID, adding them on if not there
        // ensure the image isn't already there, look for size largest and add that
        // technically if I just check the size being largest and push that URL it won't matter that imageID
        // this would get us every large image in the list for each propertyID
        if (!mediaMap.get(mediaItem.ResourceRecordKey)) {
            mediaMap.set(mediaItem.ResourceRecordKey, []);
        }

        // get existing array in map and push values into it
        // only do this if the image is the largest for that property
        if (mediaItem.ImageSizeDescription == "Largest") {
            mediaMap.get(mediaItem.ResourceRecordKey)?.push(mediaItem.MediaURL)            
        }

    }

    // loop through and update each of the property with list of rooms and list of media images
    for (const property of rawProperties) {
        property.RoomList = roomPropertyMap.get(property.id)
       
        // map media here in a similar manner (gets array of media URLs for that id from the map) 
        property.mediaImages = mediaMap.get(property.id)
    }

    // TODO: Figure out array indices syntax 
    return rawProperties;
}

async function fetchMLSProperties(webAPIAddress: string | undefined, odataFilter: string, top?: number): Promise<Property[]>{
    const url = `${webAPIAddress}/odata/property/?$filter=${odataFilter}`;

    const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MLS Property request failed- (${response.status}): ${errorText}`)
    }
    // get response json data
    const jsonData = await response.json();

    // get value which is an array of properties
    const propertiesList = jsonData.value;

    return propertiesList.map((p: any): Property => ({
        id: p.ListingKey, 
        address : {
            unparsedAddress: p.UnparsedAddress,
            stateOrProvince: p.StateOrProvince,  
            streetName: p.StreetName,
            streetNumber: p.StreetNumber,
            legalApartmentNumber: p.LegalApartmentNumber,
            city: p.City,
            cityRegion: p.CityRegion,
            crossStreet: p.CrossStreet,
            postalCode: p.PostalCode
        },
        approximateAge: p.ApproximageAge,
        architecturalStyle: p.ArchitecturalStyle,
        assessmentYear: p.AssessmentYear,
        associationAmenities: p.AssociationAmenities,
        associationFee: p.AssociationFee,
        attachedGarageExistance: p.AttachedGarageYN,
        balconyType: p.BalconyType,
        basementExist: p.BasementYN,
        basementDetails: p.Basement,
        bathroomsTotal: p.BathroomsTotalInteger,
        bedroomsAboveGrade: p.BedroomsAboveGrade,
        bedroomsBelowGrade: p.BedroomsBelowGrade,
        rawSqftTotal: p.BuildingAreaTotal,
        businessType: p.BusinessType,
        centralVacuum: p.CentralVacuumYN,

        closeDate: new Date(p.CloseDate),
        closePrice: p.ClosePrice,
        
        coolingDetails: p.Cooling,
    
        daysOnMarket: p.DaysOnMarket,
        exteriorFeatures: p.ExteriorFeatures,
        fireplaceYN: p.FireplaceYN,
        garageParkingSpaces: p.GarageParkingSpaces,
        garageYN: p.GarageYN,
        heatSourceMulti: p.HeatSourceMulti,
        heatTypeMulti: p.HeatTypeMulti,
        interiorFeatures: p.InteriorFeatures,
        inclusions: p.Inclusions,
        kitchensTotal: p.KitchensTotal,
        leaseAgreementExists: p.LeaseAgreementYN,
        leaseAmount: p.LeaseAmount,
        listPrice: p.ListPrice,
        listingDate: p.ListingContractDate ? new Date(p.ListingContractDate) : null,
        livingSqftRange: p.LivingAreaRange, 
        lotDepth: p.LotDepth,
        lotWidth: p.LotWidth,
        lotSizeArea: p.LotSizeArea,
        mainLevelBathrooms: p.MainLevelBathrooms,
        mainLevelBedrooms: p.MainLevelBedrooms,
        mlsStatus: p.MlsStatus,
    
        originalListPrice: p.OriginalListPrice,
        parkingMonthlyCost: p.ParkingMonthlyCost,
        parkingSpaces: p.ParkingSpaces,
        petsAllowed: p.PetsAllowed,
        poolFeatures: p.PoolFeatures,
        previousListPrice: p.PreviousListPrice,
        propertyFeatures: p.PropertyFeatures,
        propertyType: p.PropertyType,
        propertySubType: p.PropertySubType,
        publicRemarks: p.PublicRemarks,
        purchaseContractDate: p.PurchaseContractDate ? new Date(p.PurchaseContractDate) : null, 
        recreationRoomYN: p.RecreationRoomYN,
        roof: p.Roof,
    
        // property room end point ****** 
        RoomList: [],
    
        // Continued Property fields
        roomsTotal: p.RoomsTotal,
        securityFeatures: p.SecurityFeatures,
        sewage: p.Sewage,
        sewer: p.Sewer,
        shoreline: p.Shoreline,
        showingAppointments: p.ShowingAppointments,
        
        structureType: p.StructureType,
        taxAnnualAmount: p.TaxAnnualAmount,
    
        utilities: p.Utilities,
        view: p.View,
    
        virtualTourURLBranded: p.VirtualTourURLUnbranded,
        
        // map any relevant washrooms 
        washroomDetails: [1, 2, 3, 4, 5].map( i => {
            const washroomType = p[`WashroomsType${i}`];
            const level = p[`WashroomsType${i}Level`];
            const pieces = p[`WashroomsType${i}Pcs`];

            // only add if all atttributes are not null
            if (washroomType !== null && level !== null && pieces !== null) {
                return {
                    washroomType,
                    level,
                    pieces,
                } as Washroom;
            }
            return undefined;
        }).filter((washroom): washroom is Washroom => washroom !== undefined),
    
        water: p.Water,
        waterfrontExists: p.WaterFrontYN,
    
        // media endpoint
        mediaImages: []
    }));

}

async function fetchMLSRoomProperties(webAPIAddress: string | undefined, propertyIDs: string[]): Promise<Map<string, Room[]>> {
    const url = `${webAPIAddress}/odata/property/?$filter=ListingKey in (${propertyIDs.join(",")})`;

    const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MLS Property request failed- (${response.status}): ${errorText}`)
    }
    // get response json data
    const jsonData = await response.json();

    // get value which is an array of rooms across all properties
    const propertiesListWithRoomData = jsonData.value;

    const roomMap = new Map<string, Room[]>();

    for (const room of propertiesListWithRoomData) {
        if (!roomMap.has(room.ListingKey)) {
            roomMap.set(room.ListingKey, []);
        }
        const roomValue = {
            id: room.RoomKey,
            roomDescription: room.RoomDescription,
            roomDimensions: room.RoomDimensions,
            roomLength: room.RoomLength,
            roomWidth: room.RoomWidth,
            roomLevel: room.RoomLevel,
            roomType: room.RoomType,

            roomFeatures: [
                room.RoomFeature1,
                room.RoomFeature2,
                room.RoomFeature3,
                ...(Array.isArray(room.RoomFeatures) ? room.RoomFeatures : [])
            ]

        } as Room;

        roomMap.get(room.ListingKey)?.push(roomValue)
    }
    return roomMap;
}

/* Refine property search function */
// LLM function with properties passed through (stored array in storage)
// Figure out where and how to save user content and field values 


// Fetch Singular property
// Property with ID -> Same functions as above except with IDs 
export async function getPropertyByID(listingID: string): Promise<Property> {
    const odataQuery = `ListingKey eq '${listingID}'`;
    const property = await fetchPropertiesWithRoomsMedia(odataQuery, 1);
    return property[0];
}
