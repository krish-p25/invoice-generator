import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Free Invoice Generator</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create professional invoices instantly. Customize templates, add your logo, export to PDF. Perfect for freelancers and small businesses.
        </p>
      </div>
    </header>
  );
};
