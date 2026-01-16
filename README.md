# Invoice Generator

A modern, user-friendly invoice generator built with React, TypeScript, and Tailwind CSS. Generate professional invoices from CSV data with customizable templates.

## Features

- **CSV Template Download**: Download a pre-formatted CSV template with all required columns
- **CSV Upload & Parsing**: Upload filled CSV files with automatic validation
- **Smart Grouping**: Automatically groups invoice items by customer
- **Template Customization**:
  - Upload your company logo
  - Customize colors (primary, secondary, accent)
  - Change fonts
  - Show/hide invoice fields
- **Multiple Export Options**:
  - Individual PDF downloads
  - Bulk ZIP download (all invoices)
  - Print view with proper formatting
- **LocalStorage Persistence**: Your template customizations are saved automatically
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Customize Your Template** (Optional)
   - Click on the "Fields" tab to show/hide invoice fields
   - Click on the "Styles" tab to change colors and fonts
   - Click on the "Logo" tab to upload your company logo
   - All changes are saved automatically to localStorage

2. **Download CSV Template**
   - Click the "Download CSV Template" button at the top
   - A file named `invoice_template.csv` will be downloaded

3. **Fill in Invoice Data**
   - Open the CSV file in Excel, Google Sheets, or any spreadsheet editor
   - Fill in your invoice information:
     - **bill from**: Your company name
     - **bill to**: Customer name (used for grouping invoices)
     - **billing address**: Your company address
     - **shipping address**: Customer shipping address
     - **item description**: Product/service description
     - **item quantity**: Quantity (number)
     - **item price**: Unit price (number)
     - **item VAT**: VAT percentage (e.g., 20)
     - **invoice notes**: Additional notes
   - Add multiple rows for multiple line items
   - Items with the same "bill to" value will be grouped into one invoice

4. **Upload CSV File**
   - Drag and drop your filled CSV file or click to browse
   - The app will parse and validate your data
   - Any errors will be displayed clearly

5. **Download Invoices**
   - **Preview**: Click the "Preview" button to see the invoice before downloading
   - **Individual PDF**: Click the "PDF" button on each invoice card
   - **Print**: Click the "Print" button for browser printing
   - **Bulk Download**: Click "Download All as ZIP" to get all invoices in one file

## CSV Template Columns

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| bill from | Yes | Your company name | "Acme Corp" |
| bill to | Yes | Customer name | "John Doe" |
| billing address | Yes | Your company address | "123 Main St, City, State" |
| shipping address | No | Customer shipping address | "456 Oak Ave, City, State" |
| item description | Yes | Product/service description | "Web Development Services" |
| item quantity | Yes | Quantity (must be a number > 0) | "10" |
| item price | Yes | Unit price (must be a number >= 0) | "150.00" |
| item VAT | No | VAT percentage (defaults to 0) | "20" |
| invoice notes | No | Additional notes | "Thank you for your business!" |

## Example CSV Data

```csv
bill from,bill to,billing address,shipping address,item description,item quantity,item price,item VAT,invoice notes
Acme Corp,John Doe,"123 Main St, NY","456 Oak Ave, NY",Web Development,10,150.00,20,Thank you!
Acme Corp,John Doe,"123 Main St, NY","456 Oak Ave, NY",Hosting,1,50.00,20,Thank you!
Acme Corp,Jane Smith,"123 Main St, NY","789 Pine Rd, CA",Consulting,5,200.00,20,Great working with you!
```

This will generate:
- **1 invoice for John Doe** with 2 line items (Web Development + Hosting)
- **1 invoice for Jane Smith** with 1 line item (Consulting)

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Bootstrap
- **State Management**: Zustand
- **CSV Parsing**: PapaParse
- **PDF Generation**: jsPDF + html2canvas
- **File Handling**: react-dropzone, jszip
- **Date Utilities**: date-fns
- **Unique IDs**: uuid

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

## License

ISC

## Author

Built with Claude Code
