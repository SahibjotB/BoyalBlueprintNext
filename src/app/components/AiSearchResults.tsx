import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import PropertyDetailsModal from './PropertyDetailsModal';

import { Property } from '@/lib/types/property';

export type MockProperty = Property & { mapX: string; mapY: string; mockId: number };

export default function AiSearchResults() {
  const [selectedProperty, setSelectedProperty] = useState<MockProperty | null>(null);

  const properties = [
    {
      id: "MLS-1",
      mockId: 1,
      mapX: "60%",
      mapY: "35%",
      address: {
        unparsedAddress: "4 Ligma Balls Dr.",
        streetNumber: "4",
        streetName: "Ligma Balls Dr.",
        city: "Brampton",
        stateOrProvince: "ON",
        postalCode: "L6W 1K7"
      },
      listPrice: 849000,
      bedroomsAboveGrade: 4,
      bathroomsTotal: 3,
      propertySubType: "Single Family Residence",
      approximateAge: "1990",
      lotSizeArea: 5000,
      rawSqftTotal: 2200,
      associationFee: 50,
      propertyFeatures: ["MATURE LOT", "BRIGHT AND FUNCTIONAL KITCHEN", "SINGLE-CAR GARAGE"],
      mediaImages: ["/house_placeholder.png", "/house_placeholder.png", "/house_placeholder.png"],
    },
    {
      id: "MLS-2",
      mockId: 2,
      mapX: "40%",
      mapY: "25%",
      address: {
        unparsedAddress: "8 Ligma Balls Dr.",
        streetNumber: "8",
        streetName: "Ligma Balls Dr.",
        city: "Brampton",
        stateOrProvince: "ON",
        postalCode: "L6W 1K7"
      },
      listPrice: 920000,
      bedroomsAboveGrade: 5,
      bathroomsTotal: 4,
      propertySubType: "Single Family Detached",
      approximateAge: "2005",
      lotSizeArea: 6500,
      rawSqftTotal: 3000,
      associationFee: null,
      propertyFeatures: ["FINISHED BASEMENT", "POOL", "DOUBLE GARAGE"],
      mediaImages: ["/house_placeholder.png", "/house_placeholder.png"],
    }
  ] as unknown as MockProperty[];

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 bg-white shadow-2xl overflow-hidden rounded-2xl border border-gray-200">
      {/* Map Section */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-gray-100">
        <Image
          src="/map_placeholder.png"
          alt="Map Area"
          fill
          className="object-cover opacity-90"
        />
        {/* Map Markers */}
        {properties.map((prop) => (
          <div
            key={`marker-${prop.id}`}
            onClick={() => setSelectedProperty(prop)}
            className="absolute flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#f97316] text-white rounded-full font-bold text-xl md:text-2xl shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 cursor-pointer"
            style={{ left: prop.mapX, top: prop.mapY }}
          >
            {prop.mockId}
          </div>
        ))}
      </div>

      {/* Results Carousel Section */}
      <div className="flex items-center justify-between p-6 md:p-8 bg-white">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide flex-1">
          {properties.map((prop) => (
            <div 
              key={`card-${prop.id}`} 
              onClick={() => setSelectedProperty(prop)}
              className="flex flex-col min-w-[150px] cursor-pointer group"
            >
              <div className="text-[#f97316] font-bold text-xl md:text-2xl mb-1">
                {prop.mockId}.
              </div>
              <div className="relative w-40 h-28 md:w-48 md:h-32 mb-2 overflow-hidden rounded-md border border-gray-200 shadow-sm transition-transform group-hover:scale-105">
                <Image
                  src={prop.mediaImages?.[0] || "/house_placeholder.png"}
                  alt={prop.address?.unparsedAddress || "Property"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-[#f97316] font-bold text-sm md:text-base leading-tight">
                {prop.address?.unparsedAddress || "Address Unavailable"}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button className="flex-shrink-0 ml-4 p-2 text-[#f97316] hover:bg-orange-50 rounded-full transition-colors flex items-center justify-center">
          <ChevronRight className="w-12 h-12 md:w-16 md:h-16" strokeWidth={2} />
        </button>
      </div>

      {/* Modal */}
      <PropertyDetailsModal 
        isOpen={!!selectedProperty} 
        onClose={() => setSelectedProperty(null)} 
        property={selectedProperty} 
      />
    </div>
  );
}
