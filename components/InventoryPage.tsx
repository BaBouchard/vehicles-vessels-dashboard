'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Car, 
  Ship, 
  Package, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  Search,
  Filter,
  ChevronLeft
} from 'lucide-react';
import { Vehicle, Vessel } from '@/types/dashboard';
// Remove the direct import since we'll use API calls
import { useAuth } from '@/lib/auth';

interface InventoryPageProps {
  onBack: () => void;
}

export default function InventoryPage({ onBack }: InventoryPageProps) {
  const { username } = useAuth();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'vessels'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load inventory data
    const loadInventory = async () => {
      setLoading(true);
      try {
        // First sync with Google Sheets to get latest data
        const syncResponse = await fetch('/api/sync/google-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ forceSync: true })
        });
        
        if (syncResponse.ok) {
          console.log('Inventory synced with Google Sheets');
        }
        
        // Then get the synced data from the inventory API
        const inventoryResponse = await fetch('/api/inventory');
        if (inventoryResponse.ok) {
          const data = await inventoryResponse.json();
          console.log('Inventory page - synced vehicles:', data.vehicles.length);
          console.log('Inventory page - synced vessels:', data.vessels.length);
          if (data.vehicles.length > 0) {
            console.log('First vehicle:', data.vehicles[0]);
          }
          setVehicles(data.vehicles);
          setVessels(data.vessels);
        }
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.year.toString().includes(searchTerm)
  );

  const filteredVessels = vessels.filter(vessel =>
    vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.length.toString().includes(searchTerm)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inventory': return 'bg-gray-500';
      case 'listed': return 'bg-green-500';
      case 'sold': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      case 'expired': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'inventory': return 'In Inventory';
      case 'listed': return 'Listed';
      case 'sold': return 'Sold';
      case 'pending': return 'Pending';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen luxury-gradient">
      {/* Header */}
      <header className="bg-dark-800 shadow-lg border-b border-yellow-400 slide-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 border border-yellow-400 hover:border-yellow-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 float-animation">
                  <Image
                    src="/phonto 2.jpg"
                    alt="Vehicles & Vessels Logo"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white bounce-in">Inventory Management</h1>
                  <p className="text-yellow-400 text-sm">Manage your vehicles and vessels</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {username}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 slide-in-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Apple-style Toggle Switch */}
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium transition-colors duration-200 ${activeTab === 'vehicles' ? 'text-yellow-400' : 'text-gray-400'}`}>
                Vehicles
              </span>
              <button
                onClick={() => setActiveTab(activeTab === 'vehicles' ? 'vessels' : 'vehicles')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-dark-800 ${
                  activeTab === 'vessels' ? 'bg-yellow-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    activeTab === 'vessels' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors duration-200 ${activeTab === 'vessels' ? 'text-yellow-400' : 'text-gray-400'}`}>
                Vessels
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button 
                onClick={async () => {
                  // Sync data from Google Sheets
                  setLoading(true);
                  try {
                    const response = await fetch('/api/sync/google-sheets', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ forceSync: true })
                    });
                    
                    if (response.ok) {
                      console.log('Inventory synced with Google Sheets');
                      // Reload the data from the inventory API
                      const inventoryResponse = await fetch('/api/inventory');
                      if (inventoryResponse.ok) {
                        const data = await inventoryResponse.json();
                        setVehicles(data.vehicles);
                        setVessels(data.vessels);
                      }
                    }
                  } catch (error) {
                    console.error('Error syncing inventory:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-gray-600 hover:border-yellow-400 text-yellow-400 font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{loading ? 'Syncing...' : 'Sync'}</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 pulse-glow">
                <Plus className="h-4 w-4" />
                <span>Add {activeTab === 'vehicles' ? 'Vehicle' : 'Vessel'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-dark-800 rounded-xl shadow-lg border border-dark-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-yellow-400 font-medium">Syncing with Google Sheets...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Make</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Listed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                {activeTab === 'vehicles' ? (
                  filteredVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id} className="hover:bg-dark-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{vehicle.make}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{vehicle.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-semibold">{formatCurrency(vehicle.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehicle.status === 'listed' ? (
                          <span className="inline-flex items-center text-yellow-400">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredVessels.map((vessel, index) => {
                    // Parse the vessel name to extract make and model
                    // Vessel name is stored as "Make Model" (e.g., "Azimut Flybridge")
                    const nameParts = vessel.name.split(' ');
                    const make = nameParts[0] || '';
                    const model = nameParts.slice(1).join(' ') || '';
                    
                    return (
                      <tr key={vessel.id} className="hover:bg-dark-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vessel.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{make}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-semibold">{formatCurrency(vessel.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vessel.status === 'listed' ? (
                            <span className="inline-flex items-center text-yellow-400">
                              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Yes
                            </span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Empty State */}
        {((activeTab === 'vehicles' && filteredVehicles.length === 0) || 
          (activeTab === 'vessels' && filteredVessels.length === 0)) && (
          <div className="text-center py-12">
            <div className="relative w-24 h-24 mx-auto mb-4">
              {activeTab === 'vehicles' ? (
                <Car className="w-full h-full text-gray-600" />
              ) : (
                <Ship className="w-full h-full text-gray-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : `Add your first ${activeTab === 'vehicles' ? 'vehicle' : 'vessel'} to get started`}
            </p>
            <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 pulse-glow">
              Add {activeTab === 'vehicles' ? 'Vehicle' : 'Vessel'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
