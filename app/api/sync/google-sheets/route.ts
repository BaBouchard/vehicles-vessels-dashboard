import { NextRequest, NextResponse } from 'next/server';
import { createGoogleSheetsService } from '@/lib/googleSheets';
import { updateInventory } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const sheetsService = createGoogleSheetsService();
    
    // Test connection first
    const isConnected = await sheetsService.testConnection();
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'Google Sheets not configured or connection failed',
        message: 'Please check your Google Sheets configuration'
      }, { status: 400 });
    }

    // Fetch data from Google Sheets
    const [vehicles, vessels, sales] = await Promise.all([
      sheetsService.getVehicles(),
      sheetsService.getVessels(),
      sheetsService.getSales()
    ]);

    // Update local data store
    updateInventory(vehicles, vessels);

    return NextResponse.json({
      success: true,
      message: 'Successfully synced with Google Sheets',
      data: {
        vehicles: vehicles.length,
        vessels: vessels.length,
        sales: sales.length
      },
      lastSync: new Date().toISOString()
    });

  } catch (error) {
    console.error('Google Sheets sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: 'Failed to sync with Google Sheets',
      details: errorMessage
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try to parse body, but don't fail if it's empty
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body is empty or invalid JSON, use defaults
      body = { forceSync: false };
    }
    
    const { forceSync = false } = body;

    const sheetsService = createGoogleSheetsService();
    
    // Test connection first
    const isConnected = await sheetsService.testConnection();
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'Google Sheets not configured or connection failed',
        message: 'Please check your Google Sheets configuration'
      }, { status: 400 });
    }

    // Fetch data from Google Sheets
    const [vehicles, vessels, sales] = await Promise.all([
      sheetsService.getVehicles(),
      sheetsService.getVessels(),
      sheetsService.getSales()
    ]);

    // Update local data store
    updateInventory(vehicles, vessels);

    return NextResponse.json({
      success: true,
      message: 'Successfully synced with Google Sheets',
      data: {
        vehicles: vehicles.length,
        vessels: vessels.length,
        sales: sales.length
      },
      lastSync: new Date().toISOString(),
      forceSync
    });

  } catch (error) {
    console.error('Google Sheets sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: 'Failed to sync with Google Sheets',
      details: errorMessage
    }, { status: 500 });
  }
}
