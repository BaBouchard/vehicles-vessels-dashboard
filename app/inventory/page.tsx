'use client';

import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Ship, 
  Package, 
  Search,
  ChevronLeft,
  Database
} from 'lucide-react';
import { Vehicle, Vessel } from '@/types/dashboard';
import { useAuth } from '@/lib/auth';

export default function InventoryPage() {
  const { username } = useAuth();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'vessels'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  // Auto-sync every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      syncWithGoogleSheets();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
        setVessels(data.vessels || []);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncWithGoogleSheets = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync/google-sheets', {
        method: 'POST',
      });
      
      if (response.ok) {
        await loadInventory();
      } else {
        console.error('Failed to sync with Google Sheets');
      }
    } catch (error) {
      console.error('Error syncing with Google Sheets:', error);
    } finally {
      setSyncing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVessels = vessels.filter(vessel =>
    vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen luxury-gradient">
      {/* Header */}
      <header className="bg-dark-800 shadow-lg border-b border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Back Button and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-gray-600 hover:border-yellow-400 text-yellow-400 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
                <p className="text-yellow-400 text-sm">Manage your vehicles and vessels</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={syncWithGoogleSheets}
                disabled={syncing}
                className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-gray-600 hover:border-yellow-400 text-yellow-400 font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                title="Sync with Google Sheets"
              >
                <Database className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>
                  {syncing ? 'Syncing...' : 'Sync'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Toggle */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles or vessels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${activeTab === 'vehicles' ? 'text-yellow-400' : 'text-gray-400'}`}>
                Vehicles
              </span>
              <button
                onClick={() => setActiveTab(activeTab === 'vehicles' ? 'vessels' : 'vehicles')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  activeTab === 'vessels' ? 'bg-yellow-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    activeTab === 'vessels' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${activeTab === 'vessels' ? 'text-yellow-400' : 'text-gray-400'}`}>
                Vessels
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading inventory...</p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Make
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Listed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-800 divide-y divide-gray-700">
                  {activeTab === 'vehicles' ? (
                    filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-dark-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {vehicle.imageUrl ? (
                            <a 
                              href={vehicle.imageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-yellow-400 hover:text-yellow-300 font-semibold underline hover:no-underline transition-colors duration-200"
                            >
                              {vehicle.id}
                            </a>
                          ) : (
                            <span className="text-gray-300">{vehicle.id}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{vehicle.make}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{vehicle.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-semibold">
                          {formatCurrency(vehicle.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                          {formatCurrency(vehicle.commission)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {vehicle.status === 'listed' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                              ✓ Listed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-gray-300">
                              Inventory
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredVessels.map((vessel) => {
                      const nameParts = vessel.name.split(' ');
                      const make = nameParts[0] || '';
                      const model = nameParts.slice(1).join(' ') || '';

                      return (
                        <tr key={vessel.id} className="hover:bg-dark-700 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {vessel.imageUrl ? (
                              <a 
                                href={vessel.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-yellow-400 hover:text-yellow-300 font-semibold underline hover:no-underline transition-colors duration-200"
                              >
                                {vessel.id}
                              </a>
                            ) : (
                              <span className="text-gray-300">{vessel.id}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">2024</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{make}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{model}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-semibold">
                            {formatCurrency(vessel.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">
                            {formatCurrency(vessel.commission)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {vessel.status === 'listed' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                ✓ Listed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-gray-300">
                                Inventory
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="px-6 py-4 bg-dark-700 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>
                  Showing {activeTab === 'vehicles' ? filteredVehicles.length : filteredVessels.length} {activeTab}
                  {searchTerm && ` matching "${searchTerm}"`}
                </span>
                <span>
                  Total: {activeTab === 'vehicles' ? vehicles.length : vessels.length} {activeTab}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
