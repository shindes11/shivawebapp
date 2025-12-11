// TokenContext.tsx
'use client';
import React, { createContext, useContext, ReactNode } from 'react';

interface TokenContextProps {
  token: any;
}

const TokenContext = createContext<TokenContextProps | undefined>(undefined);

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export const TokenProvider = ({
  token,
  children,
}: {
  token: any;
  children: ReactNode;
}) => {
  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
};
