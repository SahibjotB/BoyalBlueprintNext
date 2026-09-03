'use client';

import React, { createContext, useContext, useState } from 'react';
import WebinarBookingModal from './WebinarBookingModal';

interface WebinarModalContextType {
  isWebinarModalOpen: boolean;
  openWebinarModal: () => void;
  closeWebinarModal: () => void;
}

const WebinarModalContext = createContext<WebinarModalContextType | undefined>(undefined);

export function WebinarModalProvider({ children }: { children: React.ReactNode }) {
  const [isWebinarModalOpen, setIsWebinarModalOpen] = useState(false);

  const openWebinarModal = () => setIsWebinarModalOpen(true);
  const closeWebinarModal = () => setIsWebinarModalOpen(false);

  return (
    <WebinarModalContext.Provider
      value={{
        isWebinarModalOpen,
        openWebinarModal,
        closeWebinarModal,
      }}
    >
      {children}
      <WebinarBookingModal
        isOpen={isWebinarModalOpen}
        onClose={closeWebinarModal}
      />
    </WebinarModalContext.Provider>
  );
}

export function useWebinarModal() {
  const context = useContext(WebinarModalContext);
  if (!context) {
    throw new Error('useWebinarModal must be used within a WebinarModalProvider');
  }
  return context;
}
