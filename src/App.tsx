import './App.css';
import { MainLayout } from './components/layout/MainLayout';
import { CSVUploader } from './components/csv/CSVUploader';
import { InvoiceCard } from './components/invoice/InvoiceCard';
import { BulkDownloadPanel } from './components/invoice/DownloadPanel';
import { TemplateCustomizer } from './components/template/TemplateCustomizer';
import { QuickStartGuide } from './components/common/QuickStartGuide';
import { useInvoiceStore } from './store/invoiceStore';

function App() {
  const { groupedInvoices, errors } = useInvoiceStore();

  return (
    <MainLayout topBanner={<QuickStartGuide />}>
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Template Customizer */}
        <section>
          <TemplateCustomizer />
        </section>

        {/* CSV Upload Section */}
        <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Upload Invoice Data</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Download the CSV template above, fill it with your invoice data, and upload it here.
            Invoices will be automatically grouped by customer.
          </p>
          <CSVUploader />

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-semibold text-red-800 mb-2">
                Errors ({errors.length}):
              </h3>
              <ul className="text-xs sm:text-sm text-red-700 space-y-1">
                {errors.slice(0, 5).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {errors.length > 5 && (
                  <li className="text-red-600">...and {errors.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
        </section>

        {/* Generated Invoices Display */}
        {groupedInvoices.length > 0 && (
          <>
            {/* Bulk Download Section */}
            <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Generated Invoices ({groupedInvoices.length})
                </h2>
                <BulkDownloadPanel invoices={groupedInvoices} />
              </div>
            </section>

            {/* Invoice Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {groupedInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </section>
          </>
        )}

        {/* CSV Column Reference - Only shown when no invoices generated */}
        {groupedInvoices.length === 0 && (
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3">CSV Template Columns</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">bill from</span>
                <p className="text-xs text-blue-700 mt-1">Your company name</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">bill to</span>
                <p className="text-xs text-blue-700 mt-1">Customer name (groups invoices)</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">billing address</span>
                <p className="text-xs text-blue-700 mt-1">Your company address</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">shipping address</span>
                <p className="text-xs text-blue-700 mt-1">Customer shipping address</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">item description</span>
                <p className="text-xs text-blue-700 mt-1">Product/service description</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">item quantity</span>
                <p className="text-xs text-blue-700 mt-1">Quantity (number)</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">item price</span>
                <p className="text-xs text-blue-700 mt-1">Unit price (number)</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">item VAT</span>
                <p className="text-xs text-blue-700 mt-1">VAT percentage (e.g., 20)</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-200">
                <span className="font-semibold text-blue-900">invoice notes</span>
                <p className="text-xs text-blue-700 mt-1">Additional notes</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}

export default App;
