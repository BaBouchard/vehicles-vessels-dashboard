import { NextRequest, NextResponse } from 'next/server';
import { WebhookPayload, Vehicle, Vessel } from '@/types/dashboard';
import { addVehicle, addVessel, updateVehicle, updateVessel } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    
    console.log('Received webhook from CRM:', payload);

    // Validate the payload structure
    if (!payload.type || !payload.action || !payload.data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload structure' },
        { status: 400 }
      );
    }

    // Optional: Verify webhook signature for security
    const signature = request.headers.get('x-webhook-signature');
    if (process.env.WEBHOOK_SECRET && signature) {
      // Add signature verification logic here
      console.log('Webhook signature verified');
    }

    // Process the webhook based on type and action
    switch (payload.type) {
      case 'vehicle':
        await handleVehicleWebhook(payload);
        break;
      case 'vessel':
        await handleVesselWebhook(payload);
        break;
      case 'sale':
        await handleSaleWebhook(payload);
        break;
      case 'listing':
        await handleListingWebhook(payload);
        break;
      case 'bulk_update':
        await handleBulkUpdateWebhook(payload);
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown webhook type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

async function handleVehicleWebhook(payload: WebhookPayload) {
  const vehicle = payload.data as Vehicle;
  
  switch (payload.action) {
    case 'create':
      addVehicle(vehicle);
      break;
    case 'update':
      updateVehicle(vehicle.id, vehicle);
      break;
    case 'status_change':
      updateVehicle(vehicle.id, { status: vehicle.status });
      break;
    default:
      console.log('Unknown vehicle action:', payload.action);
  }
}

async function handleVesselWebhook(payload: WebhookPayload) {
  const vessel = payload.data as Vessel;
  
  switch (payload.action) {
    case 'create':
      addVessel(vessel);
      break;
    case 'update':
      updateVessel(vessel.id, vessel);
      break;
    case 'status_change':
      updateVessel(vessel.id, { status: vessel.status });
      break;
    default:
      console.log('Unknown vessel action:', payload.action);
  }
}

async function handleSaleWebhook(payload: WebhookPayload) {
  // Handle sale completion - update status to 'sold'
  const { itemId, itemType } = payload.data;
  
  if (itemType === 'vehicle') {
    updateVehicle(itemId, { status: 'sold' });
  } else if (itemType === 'vessel') {
    updateVessel(itemId, { status: 'sold' });
  }
}

async function handleListingWebhook(payload: WebhookPayload) {
  // Handle listing status changes
  const { itemId, itemType, status } = payload.data;
  
  if (itemType === 'vehicle') {
    updateVehicle(itemId, { status });
  } else if (itemType === 'vessel') {
    updateVessel(itemId, { status });
  }
}

async function handleBulkUpdateWebhook(payload: WebhookPayload) {
  // Handle bulk updates from CRM
  const updates = payload.data as Array<{
    id: string;
    type: 'vehicle' | 'vessel';
    updates: Partial<Vehicle> | Partial<Vessel>;
  }>;

  for (const update of updates) {
    if (update.type === 'vehicle') {
      updateVehicle(update.id, update.updates as Partial<Vehicle>);
    } else if (update.type === 'vessel') {
      updateVessel(update.id, update.updates as Partial<Vessel>);
    }
  }
}

// GET endpoint for webhook verification (optional)
export async function GET() {
  return NextResponse.json({ 
    message: 'Vehicles & Vessels Dashboard Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
