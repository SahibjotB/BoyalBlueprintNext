'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import WebinarBookingModal from './WebinarBookingModal';

interface DashboardWebinarCardProps {
  initialBooking?: {
    booking_date: string;
    booking_time: string;
  } | null;
}

export default function DashboardWebinarCard({ initialBooking }: DashboardWebinarCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBooking] = useState(initialBooking || null);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group flex flex-col justify-between rounded-[24px] border border-[#f97316]/15 bg-white p-6 md:p-7 shadow-[0_10px_30px_rgba(249,115,22,0.05)] hover:border-[#f97316] hover:shadow-[0_14px_40px_rgba(249,115,22,0.15)] transition-all duration-300 relative overflow-hidden cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316] group-hover:bg-[#f97316] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
              {booking ? <Video className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </div>

            {booking ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#f97316] bg-[#f97316]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                1-on-1 Webinar
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#f97316] transition-colors flex items-center justify-between">
            {booking ? 'Webinar Booked' : 'Book Webinar'}
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#f97316]" />
          </h3>

          {booking ? (
            <div className="mt-4 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <Calendar className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>Date: <strong className="text-zinc-900">{booking.booking_date}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                <Clock className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>Time: <strong className="text-[#f97316]">{booking.booking_time}</strong></span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              Schedule a 1-on-1 consultation & webinar with industry experts to plan your home buying journey.
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-[#f97316]">
          <span>{booking ? 'Reschedule or View Details' : 'Book Free Webinar'} &rarr;</span>
          {booking && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        </div>
      </div>

      <WebinarBookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Reload page to fetch updated booking if newly booked
          window.location.reload();
        }}
      />
    </>
  );
}
