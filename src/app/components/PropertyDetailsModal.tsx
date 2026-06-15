import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Heart, Share, EyeOff, MoreHorizontal, Home, Calendar, MapPin, DollarSign, Calculator, Building2 } from 'lucide-react';
import { Property } from '@/lib/types/property';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | any;
}

export default function PropertyDetailsModal({ isOpen, onClose, property }: PropertyDetailsModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;
  if (!property || !mounted) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // 300ms matches the transition duration
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "Price on Request";
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(price);
  };

  const addressStr = property?.address?.unparsedAddress || "Address unavailable";
  const totalBeds = (property?.bedroomsAboveGrade || 0) + (property?.bedroomsBelowGrade || 0);
  const totalBaths = property?.bathroomsTotal || '--';
  const sqftPrice = property?.listPrice && property?.rawSqftTotal ? (property.listPrice / property.rawSqftTotal).toFixed(0) : '--';
  const mediaImages = property?.mediaImages || [];
  const mainImage = mediaImages[0] || "/house_placeholder.png";
  const sideImage1 = mediaImages[1] || mainImage;
  const sideImage2 = mediaImages[2] || mainImage;
  const propertyFeatures = property?.propertyFeatures || [];
  const propertyType = property?.propertySubType || "Property";
  const yearBuilt = property?.approximateAge ? `Built in ${property.approximateAge}` : "Age Unknown";
  const lotSize = property?.lotSizeArea ? `${property.lotSizeArea.toLocaleString()} Square Feet Lot` : "Lot Size Unknown";
  const hoaFee = property?.associationFee ? `C$${property.associationFee} HOA` : "No HOA Info";

  return createPortal(
    <div className={`fixed inset-0 z-[9999] bg-white transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isClosing ? 'opacity-0 scale-[0.98] translate-y-8' : 'opacity-100 scale-100 translate-y-0 animate-fadeIn'}`}>
      <div className="w-full h-full overflow-y-auto flex flex-col relative hide-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-[10000] px-4 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <button onClick={handleClose} className="flex items-center text-gray-500 hover:text-black transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer">
            <X className="w-6 h-6 md:mr-2" />
            <span className="hidden md:inline font-semibold text-lg">Back to search</span>
          </button>
          
          <div className="flex items-center gap-4 md:gap-8 text-gray-600 font-medium">
            <button className="hidden md:flex items-center hover:text-black transition-colors"><Heart className="w-5 h-5 mr-2" /> Save</button>
            <button className="hidden md:flex items-center hover:text-black transition-colors"><Share className="w-5 h-5 mr-2" /> Share</button>
            <button className="hidden lg:flex items-center hover:text-black transition-colors"><EyeOff className="w-5 h-5 mr-2" /> Hide</button>
            <button className="flex items-center hover:text-black transition-colors"><MoreHorizontal className="w-6 h-6" /></button>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 lg:p-10 flex flex-col gap-10">
          
          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[350px] md:h-[600px]">
            {/* Main Image */}
            <div className="relative w-full h-full md:col-span-3 rounded-xl overflow-hidden cursor-pointer group">
              <Image
                src={mainImage}
                alt="Main"
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 75vw"
              />
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-md text-sm font-bold flex items-center shadow-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> For sale
              </div>
            </div>
            {/* Side Images */}
            <div className="hidden md:grid grid-rows-2 gap-3 h-full">
              <div className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer group">
                <Image
                  src={sideImage1}
                  alt="Side 1"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer group">
                <Image
                  src={sideImage2}
                  alt="Side 2"
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <button className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2.5 font-bold text-sm rounded-lg shadow-xl hover:bg-white flex items-center border border-gray-100 transition-colors">
                  <MoreHorizontal className="w-4 h-4 mr-2" /> See all {mediaImages.length > 0 ? mediaImages.length : 45} photos
                </button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-16">
            <div className="flex-1 w-full">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-3 tracking-tight">{formatPrice(property?.listPrice)}</h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-6">{addressStr}</p>
              <div className="text-[#E5A57A] font-semibold flex items-center mb-10 cursor-pointer hover:underline w-max text-lg">
                <DollarSign className="w-5 h-5 mr-2 bg-[#E5A57A] text-white rounded-full p-[2px]" /> Get pre-qualified
              </div>
              
              {/* Grid of details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-12">
                <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-gray-50 p-5 rounded-xl border border-gray-100 transition-colors">
                  <Home className="w-6 h-6 text-gray-400 flex-shrink-0" /> <span className="text-gray-700 font-medium text-lg">{propertyType}</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-gray-50 p-5 rounded-xl border border-gray-100 transition-colors">
                  <Calendar className="w-6 h-6 text-gray-400 flex-shrink-0" /> <span className="text-gray-700 font-medium text-lg">{yearBuilt}</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-gray-50 p-5 rounded-xl border border-gray-100 transition-colors">
                  <MapPin className="w-6 h-6 text-gray-400 flex-shrink-0" /> <span className="text-gray-700 font-medium text-lg">{lotSize}</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-gray-50 p-5 rounded-xl border border-gray-100 transition-colors">
                  <Calculator className="w-6 h-6 text-gray-400 flex-shrink-0" /> <span className="text-gray-700 font-medium text-lg">{property?.taxAnnualAmount ? `C$${property.taxAnnualAmount.toLocaleString()} Taxes` : 'Taxes Unknown'}</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-gray-50 p-5 rounded-xl border border-gray-100 transition-colors">
                  <Building2 className="w-6 h-6 text-gray-400 flex-shrink-0" /> <span className="text-gray-700 font-medium text-lg">C${sqftPrice}/sqft</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50/80 hover:bg-gray-50 p-5 rounded-xl border border-gray-100 transition-colors">
                  <Home className="w-6 h-6 text-gray-400 flex-shrink-0" /> <span className="text-gray-700 font-medium text-lg">{hoaFee}</span>
                </div>
              </div>

              {/* What's special */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 tracking-tight">What's special</h3>
                <div className="flex flex-wrap gap-3">
                  {propertyFeatures.length > 0 ? propertyFeatures.map((feat: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 px-4 py-2 rounded-md text-sm md:text-base font-bold text-gray-800 tracking-wide uppercase shadow-sm">{feat}</span>
                  )) : (
                    <span className="text-gray-500 italic">No special features listed</span>
                  )}
                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-[400px] flex flex-col gap-8 lg:sticky lg:top-28 bg-white p-8 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex justify-around items-center px-2">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{totalBeds}</div>
                  <div className="text-gray-500 font-medium mt-1">beds</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{totalBaths}</div>
                  <div className="text-gray-500 font-medium mt-1">baths</div>
                </div>
              </div>
              <button className="w-full bg-[#E5A57A] hover:bg-[#D9956A] text-white font-bold py-4 rounded-xl transition-colors shadow-md text-xl">
                Contact agent
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>,
    document.body
  );
}
