export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  commission: number;
  status: 'inventory' | 'listed' | 'sold' | 'pending' | 'expired';
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vessel {
  id: string;
  name: string;
  type: 'yacht' | 'sailboat' | 'motorboat';
  length: number;
  price: number;
  commission: number;
  status: 'inventory' | 'listed' | 'sold' | 'pending' | 'expired';
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalVehiclesInInventory: number;
  totalVehiclesListed: number;
  totalVesselsInInventory: number;
  totalVesselsListed: number;
  totalPossibleCommission: number;
  averageCommission: number;
  averageVehiclePrice: number;
  averageVesselPrice: number;
  totalInventoryValue: number;
  commissionPercentage: number;
  listedInventoryValue: number;
  lifetimeEarnings: number;
  monthlySales: number;
  quarterlySales: number;
  yearlySales: number;
}

export interface WebhookPayload {
  type: 'vehicle' | 'vessel' | 'sale' | 'listing' | 'bulk_update';
  action: 'create' | 'update' | 'delete' | 'status_change';
  data: Vehicle | Vessel | any;
  timestamp: string;
}
