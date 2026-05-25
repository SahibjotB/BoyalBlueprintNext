export type MediaMap = {
    id: string;
    photoUrl: string;
}

export type Washroom = {
    washroomType: number | null;
    level: string | null;
    pieces: number | null;
}

export type Room = {
    id: string;
    roomDescription: string | null;
    roomDimensions: string | null;
    roomFeatures: string[] // map this + 3 of the features 
    roomLength: number | null;
    roomWidth: number | null;
    roomLevel: string | null;
    roomType: string | null;
}

export type Address = {
    // Address information 
    unparsedAddress: string;
    stateOrProvince: string | null;
    streetName: string | null;
    streetNumber: string | null;
    legalApartmentNumber: string | null;
    city: string | null;
    postalCode: string | null;
    cityRegion: string | null;
    crossStreet: string | null;
}

// CAn clean up into more subtypes after to make this cleaner
export type Property = {
    // id is the listingKey (used as Listing Key in proprertyrooms api and as ResourceRecordKey in media api)
    id: string;
    address: Address;

    approximateAge: string | null;

    architecturalStyle: string[] | null;
    assessmentYear: number | null;
    associationAmenities: string[] | null;
    associationFee: number | null;
    attachedGarageExistance: boolean | null;
    balconyType: string | string[] | null;
    basementExist: boolean | null;
    basementDetails: string[] | null;
    bathroomsTotal: number | null;
    bedroomsTotal: number | null;
    bedroomsAboveGrade: number | null;
    bedroomsBelowGrade: number | null;
    rawSqftTotal: number | null;
    businessType: string[] | null;
    centralVacuum: boolean | null;

    closeDate: Date | null;
    closePrice: number | null;

    coolingDetails: string[] | null;

    daysOnMarket: number | null;
    exteriorFeatures: string[] | null;
    fireplaceYN: boolean | null;
    garageParkingSpaces: string | null;
    garageYN: boolean | null;
    heatSourceMulti: string[] | null;
    heatTypeMulti: string[] | null;
    interiorFeatures: string[] | null;
    inclusions: string[] | null;
    kitchensTotal: number | null;
    leaseAgreementExists: boolean | null;
    leaseAmount: number | null;
    listPrice: number | null;
    listingDate: Date | null;
    livingSqftRange: string | null;
    lotWidth: number | null;
    lotDepth: number | null;
    lotSizeArea: number | null;
    mainLevelBathrooms: number | null;
    mainLevelBedrooms: number | null;
    mlsStatus: string[] | null;

    originalListPrice: number | null;
    parkingMonthlyCost: number | null;
    parkingSpaces: number | null;
    petsAllowed: string[] | null;
    poolFeatures: string[] | null;
    previousListPrice: number | null;
    propertyFeatures: string[] | null;
    propertyType: string | null;
    propertySubType: string | null;
    publicRemarks: string | null;
    purchaseContractDate: Date | null;
    recreationRoomYN: boolean | null;
    roof: string[] | null;

    // property room end point
    roomList: Room[] | undefined;

    // Continued Property fields
    roomsTotal: number | null;
    securityFeatures: string[] | null;
    sewage: string[] | null;
    sewer: string[] | null;
    shoreline: string[] | null;
    showingAppointments: string | null;

    structureType: string[] | null;
    taxAnnualAmount: number | null;

    utilities: string[] | null;
    view: string[] | null;

    virtualTourURLBranded: string | null;

    washroomDetails: Washroom[] | null;

    water: string | null;
    waterfrontExists: boolean | null;

    // media endpoint
    mediaImages: string[] | undefined;
}

export type PropertyWithoutMedia = Omit<Property, "mediaImages">;

// transformer function
export function stripMediaData(properties: Property[]): PropertyWithoutMedia[] {
    return properties.map(({ mediaImages, ...rest }) => rest);
}

