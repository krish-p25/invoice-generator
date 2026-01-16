import React from 'react';

export const QuickStartGuide: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Download CSV Template',
      description: 'Get the template and fill in your invoice details',
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
      title: 'Edit Invoice Template',
      description: 'Customize colors, fonts, logo, and layout to your liking',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      color: 'purple',
    },
    {
      number: 3,
      title: 'Upload & Generate',
      description: 'Upload your CSV and instantly generate professional invoices',
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
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-b-2 border-primary-200 py-6 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
          How to Create Professional Invoices in 3 Easy Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {steps.map((step) => {
            const colors = getColorClasses(step.color);
            return (
              <div
                key={step.number}
                className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 sm:p-6 transition-transform hover:scale-105 hover:shadow-lg relative`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number Badge */}
                  <div
                    className={`${colors.number} text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0`}
                  >
                    {step.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Icon */}
                    <div className={`${colors.icon} mb-3`}>{step.icon}</div>

                    {/* Title */}
                    <h3 className={`${colors.title} font-bold text-base sm:text-lg mb-2`}>
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className={`${colors.desc} text-xs sm:text-sm leading-relaxed`}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow for desktop view - positioned absolutely outside the box */}
                {step.number < 3 && (
                  <div className="hidden md:flex absolute -right-8 top-0 bottom-0 items-center justify-center z-10">
                    <svg
                      className="w-8 h-8 text-primary-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
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
