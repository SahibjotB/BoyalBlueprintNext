import { Property, Room, Washroom } from "../types/property";
import { chunkArray } from "../utils/arrayUtils";

/* Function that fetches properties with associated rooms and media calls made sequentially */
export async function fetchMLSProperties(odataQuery: string, resultCount: number): Promise<Property[]> {
    const webURL = process.env.MLS_API_ENDPOINT;

    // get properties base data
    const rawProperties = await fetchMLSPropertiesBase(webURL, odataQuery);

    // extract property IDs for room and media fetching
    const propertyIDs = rawProperties.map(p => p.id);

    // get rooms data
    const roomPropertyMap = await fetchMLSPropertiesRoom(webURL, propertyIDs)  

    // get media data
    const mediaMap = await fetchMLSPropertiesMedia(webURL, propertyIDs);

    /* Put it all together */
    // loop through and update each of the property with list of rooms and list of media images
    for (const property of rawProperties) {
        const rooms = roomPropertyMap.get(property.id) ?? [];
        const mediaImages = mediaMap.get(property.id) ?? [];

        property.roomList = rooms;
        property.mediaImages = mediaImages;
    }

    // TODO: Figure out array indices syntax 
    return rawProperties;
}

/* Function to fetch base MLS Properties Base Data */
async function fetchMLSPropertiesBase(webAPIAddress: string | undefined, odataFilter: string, top?: number): Promise<Property[]>{
    const url = `${webAPIAddress}/odata/Property?$filter=${odataFilter}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.MLS_TOKEN}`,
        },
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
        address: {
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
        bedroomsTotal: p.BedroomsTotal,
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
        roomList: [],

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
        washroomDetails: [1, 2, 3, 4, 5].map(i => {
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
/* Function to fetch MLS Properties Room Data */
async function fetchMLSPropertiesRoom(webAPIAddress: string | undefined, propertyIDs: string[]): Promise<Map<string, Room[]>> {

    const chunks = chunkArray(propertyIDs, 5); // chunk into groups of 5 to avoid URL length issues

    const responses = await Promise.all(chunks.map(async (chunk) => {
        const url = `${webAPIAddress}/odata/PropertyRooms?$filter=ListingKey in (${chunk.map(id => `'${id}'`).join(",")})`;
    
        const response = await fetch(url, {
            method: "GET",
            headers: { 
                Accept: "application/json",
                Authorization: `Bearer ${process.env.MLS_TOKEN}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`MLS Property request failed- (${response.status}): ${errorText}`)
        }
        // get response json data
        const jsonData = await response.json();
        
        return jsonData.value ?? [];
    }));

    // Flatten to get value which is an array of rooms across all properties
    const propertiesListWithRoomData = responses.flat();

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

/* Function to fetch MLS Properties Media Data */
async function fetchMLSPropertiesMedia(webAPIAddress: string | undefined, propertyIDs: string[]): Promise<Map<string, string[]>> {
     /* Added fix for media responses to do singular mapping call  */
    const mediaResponses = await Promise.all(
        propertyIDs.map(async (propertyID) => {

            const mediaURL =
                `${webAPIAddress}/odata/Media?$filter=ResourceRecordKey eq '${propertyID}'`;

            const response = await fetch(mediaURL, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${process.env.MLS_TOKEN}`,
                },
                cache: "no-store",
            });

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    `MLS Media request failed (${response.status}) for ${propertyID}: ${errorText}`
                );
            }

            const jsonData = await response.json();

            return jsonData.value ?? [];
        })
    );
    const mediaList = mediaResponses.flat();

    // filter the mediaList to only have largest images
    const filteredSortedMedia = mediaList
    .filter(
        (mediaItem) =>
            mediaItem.ImageSizeDescription == "Largest"
    ) 
    // updated sort function for priority ranking in images... 
    .sort((a, b) => {

        // 1. Preferred photo first
        if (a.PreferredPhotoYN && !b.PreferredPhotoYN) return -1;
        if (!a.PreferredPhotoYN && b.PreferredPhotoYN) return 1;

        // 2. Valid order next
        if (a.Order !== b.Order) {
            return a.Order - b.Order;
        }

        // 3. Oldest upload first (fallback)
        return (
            new Date(a.MediaModificationTimestamp).getTime() -
            new Date(b.MediaModificationTimestamp).getTime()
        );
    })

    const mediaMap = new Map<string, string[]>();

    for (const mediaItem of filteredSortedMedia) {
        // update the array of image urls for the propertyID, adding them on if not there
        // ensure the image isn't already there, look for size largest and add that
        // technically if I just check the size being largest and push that URL it won't matter that imageID
        // this would get us every large image in the list for each propertyID
        if (!mediaMap.has(mediaItem.ResourceRecordKey)) {
            mediaMap.set(mediaItem.ResourceRecordKey, []);
        }

        // get existing array in map and push values into it
        // only do this if the image is the largest for that property
        mediaMap.get(mediaItem.ResourceRecordKey)?.push(mediaItem.MediaURL);            
    }

    return mediaMap;
}



/* Refine property search function */
// LLM function with properties passed through (stored array in storage)
// Figure out where and how to save user content and field values 

// Fetch Singular property
// Property with ID -> Same functions as above except with IDs 
export async function getPropertyByID(listingID: string): Promise<Property> {
    const odataQuery = `ListingKey eq '${listingID}'`;
    const property = await fetchMLSProperties(odataQuery, 1);
    return property[0];
}
 