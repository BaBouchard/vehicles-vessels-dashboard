import { google } from 'googleapis';
import { Vehicle, Vessel } from '@/types/dashboard';

export class GoogleSheetsService {
  private sheets: any;
  private auth: any;

  constructor() {
    // Initialize Google Auth
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: process.env.GOOGLE_SHEETS_RANGE_VEHICLES || 'Vehicles!A:K'
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) return []; // No data or only headers

      // Skip header row and parse data
      return rows.slice(1).map((row: any[], index: number) => ({
        id: row[0] || `vehicle-${index + 1}`,
        make: row[1] || '',
        model: row[2] || '',
        year: parseInt(row[3]) || new Date().getFullYear(),
        price: parseFloat(row[4]) || 0,
        commission: parseFloat(row[5]) || 0,
        status: row[6] || 'inventory',
        description: row[7] || '',
        imageUrl: row[8] || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        createdAt: row[9] ? new Date(row[9]) : new Date(),
        updatedAt: row[10] ? new Date(row[10]) : new Date()
      }));
    } catch (error) {
      console.error('Error fetching vehicles from Google Sheets:', error);
      return [];
    }
  }

  async getVessels(): Promise<Vessel[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: process.env.GOOGLE_SHEETS_RANGE_VESSELS || 'Vessels!A:K'
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) return []; // No data or only headers

      // Skip header row and parse data
      return rows.slice(1).map((row: any[], index: number) => ({
        id: row[0] || `vessel-${index + 1}`,
        name: row[1] || '',
        type: row[2] || 'yacht',
        length: parseFloat(row[3]) || 0,
        price: parseFloat(row[4]) || 0,
        commission: parseFloat(row[5]) || 0,
        status: row[6] || 'inventory',
        description: row[7] || '',
        imageUrl: row[8] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        createdAt: row[9] ? new Date(row[9]) : new Date(),
        updatedAt: row[10] ? new Date(row[10]) : new Date()
      }));
    } catch (error) {
      console.error('Error fetching vessels from Google Sheets:', error);
      return [];
    }
  }

  async getSales(): Promise<any[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
        range: process.env.GOOGLE_SHEETS_RANGE_SALES || 'Sales!A:H'
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) return []; // No data or only headers

      // Skip header row and parse data
      return rows.slice(1).map((row: any[], index: number) => ({
        id: row[0] || `sale-${index + 1}`,
        itemId: row[1] || '',
        itemType: row[2] || 'vehicle',
        salePrice: parseFloat(row[3]) || 0,
        commission: parseFloat(row[4]) || 0,
        buyerName: row[5] || '',
        saleDate: row[6] ? new Date(row[6]) : new Date(),
        notes: row[7] || ''
      }));
    } catch (error) {
      console.error('Error fetching sales from Google Sheets:', error);
      return [];
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID
      });
      return true;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }
}

// Simple service that reads from Google Sheets CSV export
export class MockGoogleSheetsService {
  // Parse CSV line handling quoted fields with commas
  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
  async getVehicles(): Promise<Vehicle[]> {
    try {
      // Try to read from your actual Google Sheet as CSV
      const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
      if (sheetId) {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        const response = await fetch(csvUrl);
        
        if (!response.ok) {
          console.log('CSV export failed, using sample data');
          throw new Error('CSV export not accessible');
        }
        
        const csvText = await response.text();
        
        // Check if we got HTML instead of CSV (means sheet is not public)
        if (csvText.includes('<HTML>') || csvText.includes('<html>') || csvText.includes('Temporary Redirect')) {
          console.log('Sheet is not publicly accessible for CSV export, using sample data');
          console.log('Response preview:', csvText.substring(0, 200));
          throw new Error('Sheet not publicly accessible');
        }
        
        // Parse CSV data - handle commas in quoted fields
        const lines = csvText.split('\n');
        const vehicles: Vehicle[] = [];
        
        console.log('CSV data preview:', csvText.substring(0, 500));
        console.log('Number of lines:', lines.length);
        
        // Skip header row (index 0) and process data rows
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            // Better CSV parsing that handles quoted fields with commas
            const columns = this.parseCSVLine(line);
            console.log(`Row ${i}:`, columns);
            if (columns.length >= 11) {
              const id = columns[0] || '';
              
              // Only process rows that start with VEH- (vehicles), skip VES- (vessels)
              if (id.trim().startsWith('VEH-')) {
                // Clean up status field - remove quotes and fix common issues
                let status = columns[6] || 'inventory';
                status = status.replace(/['"]/g, '').trim().toLowerCase();
                
                // Map common status values to valid ones
                if (status.includes('$') || status.includes('price') || status.includes('cost')) {
                  status = 'inventory'; // If status contains price info, default to inventory
                }
                
                // Ensure status is one of the valid values
                const validStatuses = ['inventory', 'listed', 'sold', 'pending', 'expired'];
                if (!validStatuses.includes(status)) {
                  status = 'inventory'; // Default to inventory if invalid
                }
              
              // Parse price and commission - remove dollar signs and commas
              const priceStr = columns[4] || '0';
              const commissionStr = columns[5] || '0';
              const make = columns[1] || '';
              const model = columns[2] || '';
              
              const price = parseFloat(priceStr.replace(/[$,]/g, '')) || 0;
              const commission = parseFloat(commissionStr.replace(/[$,]/g, '')) || 0;
              
              // Only create vehicle if it has meaningful data (make, model, and price > 0)
              if (make.trim() && model.trim() && price > 0) {
                vehicles.push({
                  id: columns[0] || `vehicle-${i}`,
                  make: make.trim(),
                  model: model.trim(),
                  year: parseInt(columns[3]) || new Date().getFullYear(),
                  price: price,
                  commission: commission,
                  status: status,
                  description: columns[7] || '',
                  imageUrl: columns[8] || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
                  createdAt: columns[9] ? new Date(columns[9]) : new Date(),
                  updatedAt: columns[10] ? new Date(columns[10]) : new Date()
                });
              }
              }
            }
          }
        }
        
        if (vehicles.length > 0) {
          console.log(`Successfully loaded ${vehicles.length} vehicles from Google Sheet`);
          console.log('Vehicle data:', vehicles.map(v => `${v.make} ${v.model}: $${v.price}, Commission: $${v.commission}, Status: ${v.status}`));
          return vehicles;
        } else {
          console.log('No valid vehicles found in Google Sheet');
          return [];
        }
      }
    } catch (error) {
      console.error('Error reading Google Sheet CSV:', error);
    }
    
    // Return empty array if no vehicles found
    console.log('No vehicles found, returning empty array');
    return [];
  }

  async getVessels(): Promise<Vessel[]> {
    try {
      // Try to read from your actual Google Sheet as CSV (Vehicles sheet, filtering for vessels)
      const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
      if (sheetId) {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        const response = await fetch(csvUrl);
        
        if (!response.ok) {
          console.log('CSV export failed for vessels, using sample data');
          throw new Error('CSV export not accessible');
        }
        
        const csvText = await response.text();
        
        // Check if we got HTML instead of CSV (means sheet is not public)
        if (csvText.includes('<HTML>') || csvText.includes('<html>')) {
          console.log('Sheet is not publicly accessible for vessels, using sample data');
          throw new Error('Sheet not publicly accessible');
        }
        
        // Parse CSV data - handle commas in quoted fields
        const lines = csvText.split('\n');
        const vessels: Vessel[] = [];
        
        // Skip header row (index 0) and process data rows
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            // Better CSV parsing that handles quoted fields with commas
            const columns = this.parseCSVLine(line);
            if (columns.length >= 11) {
              const id = columns[0] || '';
              
              // Only process rows that start with VES- (vessels) and have meaningful data
              if (id.trim().startsWith('VES-')) {
                // Parse price and commission - remove dollar signs and commas
                const priceStr = columns[4] || '0';
                const commissionStr = columns[5] || '0';
                const make = columns[1] || '';
                const model = columns[2] || '';
                
                const price = parseFloat(priceStr.replace(/[$,]/g, '')) || 0;
                const commission = parseFloat(commissionStr.replace(/[$,]/g, '')) || 0;
                
                // Only create vessel if it has meaningful data (make, model, and price > 0)
                if (make.trim() && model.trim() && price > 0) {
                  vessels.push({
                    id: id.trim(),
                    name: `${make} ${model}`.trim(),
                    type: 'yacht',
                    length: 50 + Math.floor(Math.random() * 50), // Random length between 50-100ft
                    price: price,
                    commission: commission,
                    status: columns[6] || 'inventory',
                    description: columns[7] || '',
                    imageUrl: columns[8] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
                    createdAt: columns[9] ? new Date(columns[9]) : new Date(),
                    updatedAt: columns[10] ? new Date(columns[10]) : new Date()
                  });
                }
              }
            }
          }
        }
        
        if (vessels.length > 0) {
          console.log(`Successfully loaded ${vessels.length} vessels from Google Sheet`);
          return vessels;
        } else {
          console.log('No valid vessels found in Google Sheet');
          return [];
        }
      }
    } catch (error) {
      console.error('Error reading Google Sheet CSV for vessels:', error);
    }
    
    // Return empty array if no vessels found
    console.log('No vessels found, returning empty array');
    return [];
  }

  async getSales(): Promise<any[]> {
    return [
      {
        id: 'SALE-001',
        itemId: 'VEH-001',
        itemType: 'vehicle',
        salePrice: 450000,
        commission: 22500,
        buyerName: 'John Smith',
        saleDate: new Date('2024-01-15'),
        notes: 'Cash sale'
      }
    ];
  }

  async testConnection(): Promise<boolean> {
    return true; // Mock service always "connects"
  }
}

// Factory function to create the appropriate service
export function createGoogleSheetsService(): GoogleSheetsService | MockGoogleSheetsService {
  // For now, always use the mock service since we don't have full API setup
  // This will return the sample data instead of trying to connect to Google Sheets
  return new MockGoogleSheetsService();
}
