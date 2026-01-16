import Papa from 'papaparse';
import { CSVRow, CSVParseResult } from '../types';
import { CSV_COLUMN_MAPPINGS } from '../constants/csvTemplate';

export function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim().toLowerCase(),
      complete: (results) => {
        const parsedData: CSVRow[] = [];
        const errors: CSVParseResult['errors'] = [];

        results.data.forEach((row, index) => {
          try {
            const csvRow: CSVRow = {
              billFrom: row['bill from'] || '',
              billTo: row['bill to'] || '',
              billingAddress: row['billing address'] || '',
              shippingAddress: row['shipping address'] || '',
              itemDescription: row['item description'] || '',
              itemQuantity: row['item quantity'] || '',
              itemPrice: row['item price'] || '',
              itemVAT: row['item vat'] || '0',
              invoiceNotes: row['invoice notes'] || '',
            };

            // Validate required fields
            const missingFields: string[] = [];
            CSV_COLUMN_MAPPINGS.forEach((mapping) => {
              const value = csvRow[mapping.internalField];
              if (mapping.required && (!value || String(value).trim() === '')) {
                missingFields.push(mapping.csvHeader);
              }

              // Run custom validators
              if (mapping.validator && value) {
                if (!mapping.validator(String(value))) {
                  errors.push({
                    row: index + 2, // +2 because of 0-index and header row
                    code: 'INVALID_VALUE',
                    message: `Invalid value for "${mapping.csvHeader}": ${value}`,
                    type: 'InvalidType',
                  });
                }
              }
            });

            if (missingFields.length > 0) {
              errors.push({
                row: index + 2,
                code: 'MISSING_FIELDS',
                message: `Missing required fields: ${missingFields.join(', ')}`,
                type: 'FieldMismatch',
              });
            } else {
              parsedData.push(csvRow);
            }
          } catch (error) {
            errors.push({
              row: index + 2,
              code: 'PARSE_ERROR',
              message: error instanceof Error ? error.message : 'Unknown error',
              type: 'InvalidType',
            });
          }
        });

        resolve({
          data: parsedData,
          errors,
          meta: {
            delimiter: results.meta.delimiter,
            linebreak: results.meta.linebreak,
            fields: results.meta.fields || [],
          },
        });
      },
      error: (error: Error) => {
        resolve({
          data: [],
          errors: [
            {
              row: 0,
              code: 'FILE_ERROR',
              message: error.message,
              type: 'QuoteError',
            },
          ],
          meta: {
            delimiter: ',',
            linebreak: '\n',
            fields: [],
          },
        });
      },
    });
  });
}
