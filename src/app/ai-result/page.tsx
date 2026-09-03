'use client';

import React, { useState, useMemo, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { Property } from '@/lib/types/property';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, Sparkles } from 'lucide-react';
import { getSavedProperties, saveProperties } from '@/lib/services/storageService';
import { useRouter } from 'next/navigation';
import { mockProperties } from '@/lib/data/mockProperties';

export default function AiResultPage() {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('price-desc');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const saved = getSavedProperties();
    if (saved && saved.length > 0) {
      setProperties(saved);
    } else {
      setProperties(mockProperties);
    }
  }, []);

  const handleToggleFavorite = (propertyId: string, isFav: boolean) => {
    setFavorites((prev) => ({
      ...prev,
      [propertyId]: isFav,
    }));
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        // Query search match
        const matchesQuery = searchQuery === '' ||
          prop.address.unparsedAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (prop.address.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.id.toLowerCase().includes(searchQuery.toLowerCase());

        // City filter
        const matchesCity = selectedCity === 'All' || prop.address.city === selectedCity;

        // Property type filter
        const matchesType = selectedType === 'All' ||
          (selectedType === 'Detached' && (prop.structureType?.includes('Detached') || prop.propertySubType === 'Detached' || prop.propertySubType === 'House')) ||
          (selectedType === 'Condo' && (prop.propertySubType === 'Condo Apartment' || prop.propertySubType === 'Condo')) ||
          (selectedType === 'Semi-Detached' && (prop.propertySubType === 'Semi-Detached' || prop.propertySubType === 'Semi'));

        return matchesQuery && matchesCity && matchesType;
      })
      .sort((a, b) => {
        const priceA = a.listPrice ?? 0;
        const priceB = b.listPrice ?? 0;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'beds-desc') {
          const bedsA = a.bedroomsTotal ?? 0;
          const bedsB = b.bedroomsTotal ?? 0;
          return bedsB - bedsA;
        }
        return 0;
      });
  }, [properties, searchQuery, selectedCity, selectedType, sortBy]);

  const cities = ['All', 'Brampton', 'Toronto', 'Mississauga'];
  const types = ['All', 'Detached', 'Condo', 'Semi-Detached'];

  return (
    <div className="w-full min-h-screen bg-[#fafafc] pt-24 pb-16 flex flex-col">
      {/* Header Panel */}
      <div className="w-full bg-white border-b border-neutral-100 py-10 md:py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#e57c35] font-bold text-2xl uppercase tracking-wider mb-2">
                <Sparkles className="w-6 h-6" />
                AI Search Results
              </div>
              <p className="text-neutral-500 mt-2 text-base md:text-lg max-w-2xl">
                Here are the matching properties discovered on your last search. Clean, verified, and personalized to your blueprint.
              </p>
            </div>

            {/* Search Input & Refinement Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search address or MLS ID..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-full py-3 px-5 pl-11 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#e57c35] focus:bg-white transition-all text-sm"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <button
                onClick={() => {
                  saveProperties(filteredProperties);
                  router.push('/ai-search');
                }}
                className="flex items-center justify-center gap-2 bg-[#e57c35] hover:bg-[#d46a24] text-white font-bold py-3 px-6 rounded-full transition-all text-sm shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                Refine with AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control panel (Filters + Sorting) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white border border-neutral-150 rounded-2xl p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter By
            </div>

            {/* City filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-neutral-500 font-medium">City:</span>
              <div className="flex gap-1">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCity === city
                      ? 'bg-[#e57c35] text-white'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/60'
                      }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-4 w-px bg-neutral-200 mx-2 hidden sm:block"></div>

            {/* Type filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-neutral-500 font-medium">Type:</span>
              <div className="flex gap-1">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedType === type
                      ? 'bg-[#e57c35] text-white'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/60'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sorting / Results count */}
          <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-100">
            <span className="text-xs md:text-sm font-medium text-neutral-500">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'result' : 'results'} found
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold py-1.5 pl-2 pr-8 text-neutral-700 focus:outline-none focus:border-[#e57c35] cursor-pointer"
              >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="beds-desc">Bedrooms: Most to Least</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(prop) => setSelectedProperty(prop)}
                onToggleFavorite={handleToggleFavorite}
                isFavoriteInitial={!!favorites[property.id]}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-neutral-150 rounded-2xl p-12 text-center mt-8 flex flex-col items-center shadow-sm">
            <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4">
              <RefreshCw className="w-8 h-8 animate-spin-slow" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800">No properties found</h3>
            <p className="text-neutral-500 mt-2 text-sm max-w-md">
              We couldn't find any listings matching your filters or search query. Try clearing your filters or testing with a different search word.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setSelectedType('All');
              }}
              className="mt-6 bg-[#e57c35] hover:bg-[#d46a24] text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
      />
    </div>
  );
}
