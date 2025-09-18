import { DashboardStats, Vehicle, Vessel } from '@/types/dashboard';

// In-memory data store with better persistence
let vehicles: Vehicle[] = [];
let vessels: Vessel[] = [];
let lastGoogleSheetsSync: Date | null = null;
let isInitialized = false;

export function getDashboardStats(): DashboardStats {
  // Don't initialize sample data - let it show empty state instead
  
  // Inventory = only active vehicles/vessels (exclude expired and sold)
  const activeVehicles = vehicles.filter(v => !['expired', 'sold'].includes(v.status));
  const totalVehiclesInInventory = activeVehicles.length;
  const totalVehiclesListed = activeVehicles.filter(v => v.status === 'listed').length;
  
  const activeVessels = vessels.filter(v => !['expired', 'sold'].includes(v.status));
  const totalVesselsInInventory = activeVessels.length;
  const totalVesselsListed = activeVessels.filter(v => v.status === 'listed').length;
  
  const allActiveItems = [...activeVehicles, ...activeVessels];
  const totalPossibleCommission = allActiveItems.reduce((sum, item) => sum + item.commission, 0);
  const averageCommission = allActiveItems.length > 0 ? totalPossibleCommission / allActiveItems.length : 0;
  
  // Calculate lifetime earnings from sold items
  const soldItems = [...vehicles, ...vessels].filter(item => item.status === 'sold');
  const lifetimeEarnings = soldItems.reduce((sum, item) => sum + item.commission, 0);
  
  const vehiclePrices = activeVehicles.map(v => v.price);
  const vesselPrices = activeVessels.map(v => v.price);
  
  const averageVehiclePrice = vehiclePrices.length > 0 
    ? vehiclePrices.reduce((sum, price) => sum + price, 0) / vehiclePrices.length 
    : 0;
    
  const averageVesselPrice = vesselPrices.length > 0 
    ? vesselPrices.reduce((sum, price) => sum + price, 0) / vesselPrices.length 
    : 0;
  
  const totalInventoryValue = allActiveItems.reduce((sum, item) => sum + item.price, 0);
  
  // Calculate commission percentage
  const commissionPercentage = totalInventoryValue > 0 
    ? (totalPossibleCommission / totalInventoryValue) * 100 
    : 0;
  
  // Calculate listed inventory value (only listed items)
  const listedItems = allActiveItems.filter(item => item.status === 'listed');
  const listedInventoryValue = listedItems.reduce((sum, item) => sum + item.price, 0);
  
  // Mock sales data (in production, this would come from actual sales records)
  const monthlySales = 12;
  const quarterlySales = 45;
  const yearlySales = 180;

  return {
    totalVehiclesInInventory,
    totalVehiclesListed,
    totalVesselsInInventory,
    totalVesselsListed,
    totalPossibleCommission,
    averageCommission,
    averageVehiclePrice,
    averageVesselPrice,
    totalInventoryValue,
    commissionPercentage,
    listedInventoryValue,
    lifetimeEarnings,
    monthlySales,
    quarterlySales,
    yearlySales,
  };
}

export function addVehicle(vehicle: Vehicle): void {
  vehicles.push(vehicle);
}

export function addVessel(vessel: Vessel): void {
  vessels.push(vessel);
}

export function updateVehicle(id: string, updates: Partial<Vehicle>): void {
  const index = vehicles.findIndex(v => v.id === id);
  if (index !== -1) {
    vehicles[index] = { ...vehicles[index], ...updates };
  }
}

export function updateVessel(id: string, updates: Partial<Vessel>): void {
  const index = vessels.findIndex(v => v.id === id);
  if (index !== -1) {
    vessels[index] = { ...vessels[index], ...updates };
  }
}

export function getAllVehicles(): Vehicle[] {
  // Return empty array if no vehicles - no sample data
  return vehicles;
}

export function getAllVessels(): Vessel[] {
  // Return empty array if no vessels - no sample data
  return vessels;
}

// Initialize with some sample data
export function initializeSampleData(): void {
  if (vehicles.length === 0 && vessels.length === 0) {
    // Sample vehicles
    vehicles = [
      {
        id: '1',
        make: 'Ferrari',
        model: '488 GTB',
        year: 2020,
        price: 285000,
        commission: 14250,
        status: 'listed',
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        description: 'Beautiful Ferrari 488 GTB in Rosso Corsa with carbon fiber package',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        make: 'Lamborghini',
        model: 'Huracán EVO',
        year: 2021,
        price: 245000,
        commission: 12250,
        status: 'inventory',
        imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c47fadab?w=400&h=300&fit=crop',
        description: 'Stunning Lamborghini Huracán EVO in Verde Mantis with full leather interior',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        make: 'McLaren',
        model: '720S',
        year: 2019,
        price: 295000,
        commission: 14750,
        status: 'listed',
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
        description: 'McLaren 720S in Volcano Orange with track package',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        make: 'Porsche',
        model: '911 Turbo S',
        year: 2022,
        price: 195000,
        commission: 9750,
        status: 'inventory',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
        description: 'Porsche 911 Turbo S in Guards Red with carbon ceramic brakes',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        make: 'Aston Martin',
        model: 'DB11',
        year: 2021,
        price: 225000,
        commission: 11250,
        status: 'listed',
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
        description: 'Aston Martin DB11 V8 in Quantum Silver with premium audio',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        make: 'Bentley',
        model: 'Continental GT',
        year: 2020,
        price: 195000,
        commission: 9750,
        status: 'inventory',
        imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop',
        description: 'Bentley Continental GT V8 in Beluga Black with Mulliner package',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '7',
        make: 'Rolls-Royce',
        model: 'Ghost',
        year: 2022,
        price: 350000,
        commission: 17500,
        status: 'listed',
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
        description: 'Rolls-Royce Ghost in Arctic White with bespoke interior',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '8',
        make: 'Bugatti',
        model: 'Chiron',
        year: 2020,
        price: 3200000,
        commission: 160000,
        status: 'sold',
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
        description: 'Bugatti Chiron in Bugatti Blue with exposed carbon fiber',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '9',
        make: 'Mercedes-Benz',
        model: 'AMG GT Black Series',
        year: 2021,
        price: 275000,
        commission: 13750,
        status: 'pending',
        imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop',
        description: 'Mercedes-AMG GT Black Series in Solarbeam Yellow',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '10',
        make: 'BMW',
        model: 'M8 Competition',
        year: 2022,
        price: 145000,
        commission: 7250,
        status: 'inventory',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
        description: 'BMW M8 Competition in Marina Bay Blue with carbon package',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Sample vessels
    vessels = [
      {
        id: '1',
        name: 'Ocean Dream',
        type: 'yacht',
        length: 85,
        price: 2850000,
        commission: 142500,
        status: 'listed',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Luxury 85ft motor yacht with 5 cabins, jacuzzi, and helipad',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Sea Breeze',
        type: 'sailboat',
        length: 45,
        price: 485000,
        commission: 24250,
        status: 'inventory',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Elegant 45ft sailing yacht with carbon fiber rigging',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Aqua Luxury',
        type: 'yacht',
        length: 120,
        price: 8500000,
        commission: 425000,
        status: 'listed',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Superyacht 120ft with cinema, gym, and infinity pool',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Wind Dancer',
        type: 'sailboat',
        length: 65,
        price: 1250000,
        commission: 62500,
        status: 'inventory',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Performance sailing yacht 65ft with racing pedigree',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Royal Wave',
        type: 'yacht',
        length: 95,
        price: 4200000,
        commission: 210000,
        status: 'listed',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Luxury 95ft yacht with marble finishes and wine cellar',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'Blue Horizon',
        type: 'motorboat',
        length: 35,
        price: 285000,
        commission: 14250,
        status: 'inventory',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Sport fishing boat 35ft with twin engines and fish finder',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '7',
        name: 'Crystal Waters',
        type: 'yacht',
        length: 75,
        price: 1850000,
        commission: 92500,
        status: 'sold',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Motor yacht 75ft with panoramic windows and sun deck',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '8',
        name: 'Sunset Cruiser',
        type: 'sailboat',
        length: 55,
        price: 750000,
        commission: 37500,
        status: 'pending',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Cruising sailboat 55ft with spacious cockpit and galley',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '9',
        name: 'Island Explorer',
        type: 'yacht',
        length: 110,
        price: 6500000,
        commission: 325000,
        status: 'listed',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'Explorer yacht 110ft with fuel capacity for long voyages',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '10',
        name: 'Thunder Bay',
        type: 'motorboat',
        length: 42,
        price: 425000,
        commission: 21250,
        status: 'inventory',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        description: 'High-performance motorboat 42ft with racing hull design',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

// Google Sheets integration functions
export function updateInventory(newVehicles: Vehicle[], newVessels: Vessel[]) {
  // Only update if we have actual data, don't overwrite with empty arrays
  if (newVehicles.length > 0) {
    vehicles = newVehicles;
  }
  if (newVessels.length > 0) {
    vessels = newVessels;
  }
  lastGoogleSheetsSync = new Date();
  isInitialized = true; // Mark as initialized so sample data won't overwrite
}

export function getLastGoogleSheetsSync(): Date | null {
  return lastGoogleSheetsSync;
}

export function isGoogleSheetsConfigured(): boolean {
  return !!(process.env.GOOGLE_SHEETS_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE);
}
