import React from 'react';
import { CSVDownloadButton } from '../csv/CSVDownloadButton';

export const QuickStartGuide: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Download the CSV Template',
      description: 'Click "Download CSV Template" to get a pre-formatted spreadsheet. Open it in Excel, Google Sheets, or any spreadsheet app — each row represents one line item. Fill in your company name, customer details, item descriptions, quantities, and prices. You can add multiple rows for the same customer to bundle them into a single invoice.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: 'blue',
    },
    {
      number: 2,
      title: 'Upload Your CSV',
      description: 'Once your spreadsheet is filled in, save it as a CSV file and drag it into the upload area (or click to browse). The tool will instantly parse your data and group rows by customer — every unique customer gets their own invoice automatically, with all their line items combined.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
      color: 'purple',
    },
    {
      number: 3,
      title: 'Download All Invoices',
      description: 'Your invoices appear as cards below — preview each one or download them individually. Use the "Download All as ZIP" button to export every invoice as a PDF in one click, ready to send to your customers.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8M10 12v4m4-4v4"
          />
        </svg>
      ),
      color: 'green',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        number: 'bg-blue-600',
        title: 'text-blue-900',
        desc: 'text-blue-700',
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        number: 'bg-purple-600',
        title: 'text-purple-900',
        desc: 'text-purple-700',
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        number: 'bg-green-600',
        title: 'text-green-900',
        desc: 'text-green-700',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 py-6 sm:py-8 rounded-xl shadow-md px-4">
      <div className="container mx-auto px-0 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            How to Generate Bulk Invoices in 3 Easy Steps
          </h2>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <CSVDownloadButton className="w-full sm:w-auto justify-center" />
          </div>
        </div>
        <div className="space-y-3 max-w-4xl mx-auto">
          {steps.map((step) => {
            const colors = getColorClasses(step.color);
            return (
              <div key={step.number}>
                <div className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 sm:p-5 flex items-start gap-4`}>
                  {/* Left: number badge + icon stacked */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className={`${colors.number} text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg`}>
                      {step.number}
                    </div>
                    <div className={`${colors.icon}`}>{step.icon}</div>
                  </div>

                  {/* Right: title + description */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className={`${colors.title} font-bold text-base sm:text-lg mb-1.5`}>
                      {step.title}
                    </h3>
                    <p className={`${colors.desc} text-sm leading-relaxed`}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector arrow between steps */}
                {step.number < 3 && (
                  <div className="flex justify-center py-1">
                    <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
