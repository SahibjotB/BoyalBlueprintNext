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