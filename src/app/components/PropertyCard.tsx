'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/lib/types/property';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  onToggleFavorite?: (propertyId: string, isFavorite: boolean) => void;
  isFavoriteInitial?: boolean;
}

export default function PropertyCard({
  property,
  onSelect,
  onToggleFavorite,
  isFavoriteInitial = false,
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [isHovered, setIsHovered] = useState(false);

  const images = property.mediaImages && property.mediaImages.length > 0
    ? property.mediaImages
    : ['/house_placeholder.png'];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    if (onToggleFavorite) {
      onToggleFavorite(property.id, newFavoriteState);
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return 'C$0';
    return `C$${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(price)}`;
  };

  const getDetailsString = () => {
    const beds = property.bedroomsTotal ?? property.bedroomsAboveGrade ?? 0;
    const baths = property.bathroomsTotal ?? 0;
    const subType = property.propertySubType ?? 'House';
    return `${beds} bds | ${baths} ba | ${subType} for sale`;
  };

  const getAddressString = () => {
    const addr = property.address;
    if (!addr) return 'Address N/A';

    // Format: unparsed address or building standard street Address
    const street = addr.unparsedAddress || `${addr.streetNumber || ''} ${addr.streetName || ''}`.trim();
    const city = addr.city || '';
    const state = addr.stateOrProvince || '';
    const postal = addr.postalCode || '';

    return `${street}, ${city}, ${state} ${postal}`.trim();
  };

  return (
    <div
      onClick={() => onSelect && onSelect(property)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col bg-white border border-neutral-200 rounded-[20px] shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 w-full select-none"
    >
      {/* Image & Overlay Area */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100 group">
        <Image
          src={images[currentImageIndex]}
          alt={property.address?.unparsedAddress || 'Property'}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-w-7xl) 33vw, 50vw, 100vw"
          priority={currentImageIndex === 0}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 p-1.5 rounded-full z-10 transition-transform active:scale-95 duration-150 group"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-colors duration-300 ${isFavorite
              ? 'fill-red-500 stroke-white'
              : 'fill-black/35 stroke-white'
              }`}
            strokeWidth={2.5}
          />
        </button>

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && isHovered && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md text-neutral-800 transition-opacity duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md text-neutral-800 transition-opacity duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-[2px]">
            {images.slice(0, 5).map((_, idx) => {
              // Map index to visually represent active slide
              // If there are more than 5 images, show standard up to 5 dots
              const isActive = idx === currentImageIndex % 5;
              return (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-white scale-110' : 'bg-white/40'
                    }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Details / Text Area */}
      <div className="flex flex-col p-4 md:p-5">
        {/* Row 1: Price and Action Menu */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-2xl md:text-[26px] font-bold text-neutral-900 tracking-tight leading-none">
            {formatPrice(property.listPrice)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Standard action menu dialog/popover would trigger here
              alert(`Details for Property ${property.id}`);
            }}
            className="text-[#0052cc] hover:text-[#0040a3] p-1 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="More actions"
          >
            <MoreHorizontal className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        {/* Row 2: Beds | Baths | Subtype */}
        <div className="text-base md:text-lg text-neutral-800 font-medium mb-1">
          {getDetailsString()}
        </div>

        {/* Row 3: Address */}
        <div className="text-sm md:text-base text-neutral-500 font-normal leading-relaxed mb-3">
          {getAddressString()}
        </div>

        {/* Row 4: MLS Source ID / Broker info */}
        <div className="text-[10px] md:text-[11px] text-neutral-400 font-semibold uppercase tracking-wider leading-tight truncate">
          MLS® ID #{property.id}
        </div>
      </div>
    </div>
  );
}
