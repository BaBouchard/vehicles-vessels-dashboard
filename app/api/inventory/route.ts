import { NextResponse } from 'next/server';
import { getAllVehicles, getAllVessels } from '@/lib/data';
import { createGoogleSheetsService } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Use the same data store as the stats API
    const allVehicles = getAllVehicles();
    const allVessels = getAllVessels();
    
    // Filter out expired and sold items for inventory display
    const vehicles = allVehicles.filter(v => !['expired', 'sold'].includes(v.status));
    const vessels = allVessels.filter(v => !['expired', 'sold'].includes(v.status));
    
    console.log('Inventory API - vehicles:', vehicles.length);
    console.log('Inventory API - vessels:', vessels.length);
    
    return NextResponse.json({
      vehicles,
      vessels
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
