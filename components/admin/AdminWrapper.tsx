'use client';

import { ReactNode } from 'react';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface AdminWrapperProps {
  children: ReactNode;
}

export function AdminWrapper({ children }: AdminWrapperProps) {
  const isAdmin = useIsAdmin();
  return isAdmin ? <>{children}</> : null;
}
