import { NextRequest, NextResponse } from 'next/server';
import { createGoogleSheetsService } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    console.log('Received webhook from Google Sheets:', payload);

    // Validate the payload structure
    if (!payload.type || !payload.sheet) {
      return NextResponse.json(
        { error: 'Invalid webhook payload structure' },
        { status: 400 }
      );
    }

    // Process the webhook based on type
    switch (payload.type) {
      case 'sheet_update':
        await handleSheetUpdate(payload);
        break;
      case 'sheet_edit':
        await handleSheetEdit(payload);
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown webhook type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Google Sheets webhook processed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Google Sheets webhook processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

async function handleSheetUpdate(payload: any) {
  const { sheet, range, values } = payload;
  
  console.log(`Sheet ${sheet} updated at range ${range}:`, values);
  
  // Trigger a sync with Google Sheets
  const sheetsService = createGoogleSheetsService();
  
  try {
    if (sheet.toLowerCase() === 'vehicles') {
      await sheetsService.getVehicles();
    } else if (sheet.toLowerCase() === 'vessels') {
      await sheetsService.getVessels();
    } else if (sheet.toLowerCase() === 'sales') {
      await sheetsService.getSales();
    }
  } catch (error) {
    console.error('Error syncing updated sheet:', error);
  }
}

async function handleSheetEdit(payload: any) {
  const { sheet, cell, oldValue, newValue } = payload;
  
  console.log(`Sheet ${sheet} cell ${cell} changed from "${oldValue}" to "${newValue}"`);
  
  // You can add specific logic here for different types of edits
  // For example, if a vehicle status changes from 'inventory' to 'sold'
  if (sheet.toLowerCase() === 'vehicles' && cell.includes('G')) { // Status column
    console.log('Vehicle status changed, triggering sync...');
    // Trigger sync
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'Google Sheets Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
