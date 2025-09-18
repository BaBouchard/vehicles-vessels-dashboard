import { NextResponse } from 'next/server';
import { getAllVehicles, getAllVessels } from '@/lib/data';

export async function GET() {
  try {
    // Get ALL vehicles and vessels for chart (including expired and sold)
    const allVehicles = getAllVehicles();
    const allVessels = getAllVessels();
    
    console.log('Chart Data API - all vehicles:', allVehicles.length);
    console.log('Chart Data API - all vessels:', allVessels.length);
    
    return NextResponse.json({
      vehicles: allVehicles,
      vessels: allVessels
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
