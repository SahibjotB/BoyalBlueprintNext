'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, Clock, User, Mail, Phone, X, CheckCircle2, AlertCircle, Loader2, Sparkles, LogIn, ArrowRight } from 'lucide-react';

interface WebinarBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
];

export default function WebinarBookingModal({ isOpen, onClose }: WebinarBookingModalProps) {
  const { data: session, status } = useSession();

  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Set default phone from session if available
  useEffect(() => {
    if (session?.user) {
      const userPhone = (session.user as any).phone || '';
      setPhone(userPhone);
    }
  }, [session]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Get minimum date allowed (today)
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!date) {
      setErrorMessage('Please select a date for your appointment.');
      return;
    }
    if (!selectedTime) {
      setErrorMessage('Please select a time slot for your appointment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/book-webinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          time: selectedTime,
          phone,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred while booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    setDate('');
    setSelectedTime('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-6 sm:p-8 shrink-0">
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            1-on-1 Consultation & Webinar
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white">
            Book Your Free Webinar Session
          </h2>
          <p className="text-sm text-zinc-300 mt-1 font-sans">
            Pick a date and time that works best for your schedule.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {status === 'loading' && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#f97316] animate-spin" />
              <p className="text-sm text-zinc-600 font-medium">Checking your account details...</p>
            </div>
          )}

          {status === 'unauthenticated' && (
            <div className="py-6 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#f97316]/10 text-[#f97316] flex items-center justify-center border border-[#f97316]/20 shadow-inner">
                <LogIn className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-bold text-zinc-900">Sign In Required</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  To reserve your slot for the Free Webinar and receive your personalized appointment confirmation, please sign in to your account or register below.
                </p>
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold py-3 px-6 shadow-md hover:shadow-lg transition-all text-sm"
                >
                  Sign In to Book <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold py-3 px-6 transition-all text-sm"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {status === 'authenticated' && isSuccess && (
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-zinc-900">Appointment Confirmed!</h3>
                <p className="text-sm text-zinc-600 max-w-md">
                  Thank you, <span className="font-semibold text-zinc-900">{session?.user?.name}</span>! Your webinar booking request has been submitted for <span className="font-semibold text-[#f97316]">{date}</span> at <span className="font-semibold text-[#f97316]">{selectedTime}</span>.
                </p>
                <p className="text-xs text-zinc-500">
                  Confirmation details have been dispatched to <strong>sahibjot.28@gmail.com</strong>.
                </p>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full max-w-xs mt-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 text-sm transition-all"
              >
                Close Window
              </button>
            </div>
          )}

          {status === 'authenticated' && !isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Summary Card */}
              <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 space-y-3">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Account Details (Auto-filled)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2.5 text-zinc-800 font-medium">
                    <User className="w-4 h-4 text-[#f97316] shrink-0" />
                    <span className="truncate">{session?.user?.name || 'User'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-zinc-800 font-medium">
                    <Mail className="w-4 h-4 text-[#f97316] shrink-0" />
                    <span className="truncate">{session?.user?.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200/60 flex flex-col gap-1.5">
                  <label htmlFor="modal-phone" className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#f97316]" /> Contact Phone Number
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label htmlFor="webinar-date" className="block text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#f97316]" /> Select Date
                </label>
                <input
                  id="webinar-date"
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full h-11 rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#f97316] shadow-xs"
                />
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f97316]" /> Select Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#f97316] text-white border-[#f97316] shadow-md scale-[1.02]'
                            : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#f97316]/50 hover:bg-[#f97316]/5'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label htmlFor="webinar-notes" className="block text-sm font-semibold text-zinc-800">
                  Questions or Specific Topics (Optional)
                </label>
                <textarea
                  id="webinar-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. First-time home buying process, mortgage options, investing strategies..."
                  className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#f97316] placeholder:text-zinc-400"
                />
              </div>

              {/* Error Notification */}
              {errorMessage && (
                <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3.5 px-6 shadow-lg shadow-[#f97316]/25 hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirming Booking...
                  </>
                ) : (
                  <>
                    Confirm & Book Appointment <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
