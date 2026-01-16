import React from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  topBanner?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, topBanner }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {topBanner}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">{children}</main>
    </div>
  );
};
