import React, { useState } from 'react';
import { StylePanel } from './StylePanel';
import { FieldVisibilityPanel } from './FieldVisibilityPanel';
import { TemplateCanvas } from './TemplateCanvas';

type Tab = 'fields' | 'styles';

export const TemplateCustomizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('styles');
  const [showCustomizer, setShowCustomizer] = useState(true);

  const tabs: Array<{ id: Tab; label: string; icon: JSX.Element }> = [
    {
      id: 'styles',
      label: 'Styles',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    },
    {
      id: 'fields',
      label: 'Fields',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Template Canvas - Always visible */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 sm:px-6 py-3 sm:py-4 text-white">
          <h2 className="text-xl sm:text-2xl font-bold">Invoice Template</h2>
          <p className="text-primary-100 mt-1 text-sm">
            Customize your invoice design - changes apply in real-time
          </p>
        </div>
        <div className="p-3 sm:p-6">
          <TemplateCanvas />
        </div>
      </div>

      {/* Customization Panel - Collapsible */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="w-full bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="text-left">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Customization Options</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Adjust colors, fonts, and field visibility
            </p>
          </div>
          <svg
            className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 transition-transform duration-200 flex-shrink-0 ml-2 ${
              showCustomizer ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showCustomizer && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap
                    transition-colors duration-200 min-w-fit
                    ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="hidden sm:inline">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'fields' && <FieldVisibilityPanel />}
              {activeTab === 'styles' && <StylePanel />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
