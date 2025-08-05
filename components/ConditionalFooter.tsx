'use client';

import { useFooter } from '@/contexts/footer-context';
import { ClientFooter } from './ClientFooter';

export function ConditionalFooter() {
  const { hasCustomFooter } = useFooter();
  
  // Don't render the default footer if there's a custom footer section
  if (hasCustomFooter) {
    return null;
  }
  
  return <ClientFooter />;
}
