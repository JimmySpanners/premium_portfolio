'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface FooterContextType {
  hasCustomFooter: boolean;
  setHasCustomFooter: (hasFooter: boolean) => void;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export function FooterProvider({ children }: { children: ReactNode }) {
  const [hasCustomFooter, setHasCustomFooter] = useState(false);

  return (
    <FooterContext.Provider value={{ hasCustomFooter, setHasCustomFooter }}>
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter() {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
}
