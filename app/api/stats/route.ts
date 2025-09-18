import { NextResponse } from 'next/server';
import { getDashboardStats, initializeSampleData } from '@/lib/data';

export async function GET() {
  try {
    // Only initialize sample data if no data exists
    // Don't overwrite synced data
    const stats = getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
