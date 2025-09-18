'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Database, Car, Ship, DollarSign, TrendingUp, List, Package, BarChart3, LogOut, Percent } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SalesChart from '@/components/SalesChart';
import InventoryChart from '@/components/InventoryChart';
import LoginForm from '@/components/LoginForm';
import TypewriterWelcome from '@/components/TypewriterWelcome';

interface DashboardStats {
  totalVehiclesInInventory: number;
  totalVehiclesListed: number;
  totalVesselsInInventory: number;
  totalVesselsListed: number;
  totalPossibleCommission: number;
  averageCommission: number;
  averageVehiclePrice: number;
  averageVesselPrice: number;
  totalInventoryValue: number;
  listedInventoryValue: number;
  commissionPercentage: number;
  lifetimeEarnings: number;
  monthlySales: number;
  quarterlySales: number;
  yearlySales: number;
}

export default function Dashboard() {
  const { isAuthenticated, username, login, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vessels, setVessels] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [isGarageAnimating, setIsGarageAnimating] = useState(false);
  const [isGarageComplete, setIsGarageComplete] = useState(false);
  const [typewriterKey, setTypewriterKey] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleGarageLogin = (username: string, password: string) => {
    const isValid = login(username, password);
    if (isValid) {
      // Start garage door animation immediately
      setIsGarageAnimating(true);
      
      // Sync data immediately while door is opening
      syncWithGoogleSheets();
      
      // Animation duration is 2 seconds
      setTimeout(() => {
        setIsGarageAnimating(false);
        setIsGarageComplete(true);
      }, 2000);
    }
    return isValid;
  };

  const syncWithGoogleSheets = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync/google-sheets', {
        method: 'POST',
      });
      
      if (response.ok) {
        await fetchStats();
      } else {
        console.error('Failed to sync with Google Sheets');
      }
    } catch (error) {
      console.error('Error syncing with Google Sheets:', error);
    } finally {
      setSyncing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
      
      // Also fetch ALL vehicle and vessel data for the chart (including expired/sold)
      const chartDataResponse = await fetch('/api/chart-data');
      if (chartDataResponse.ok) {
        const chartData = await chartDataResponse.json();
        setVehicles(chartData.vehicles);
        setVessels(chartData.vessels);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Auto-sync when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  // Reset typewriter animation when component mounts or when returning from inventory
  useEffect(() => {
    if (isAuthenticated) {
      // Always reset the animation state when the dashboard component mounts
      setIsGarageComplete(false);
      setTypewriterKey(prev => prev + 1);
      
      // Set a small delay to start the animation after component is fully mounted
      const timer = setTimeout(() => {
        setIsGarageComplete(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]); // This will run every time the component mounts (including when returning from inventory)

  // Auto-sync every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      syncWithGoogleSheets();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleGarageLogin} />;
  }

  return (
    <div className="min-h-screen luxury-gradient relative">
      {/* Garage Door Overlay */}
      {isGarageAnimating && (
        <div className="fixed inset-0 z-50 animate-garage-door-open">
          <Image
            src="/garage.jpeg"
            alt="Garage Door"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      {/* Header */}
      <header className="bg-dark-800 shadow-lg border-b border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12">
                <Image
                  src="/logo-small.jpg"
                  alt="Vehicles & Vessels Logo"
                  width={48}
                  height={48}
                  className="object-contain rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Vehicles & Vessels</h1>
                <p className="text-yellow-400 text-sm">Exotic Car & Yacht Brokerage</p>
              </div>
            </div>

            {/* Welcome Message - Center */}
            <div className="flex-1 flex justify-center items-center space-x-3">
              <TypewriterWelcome 
                key={`typewriter-${typewriterKey}-${Date.now()}`} 
                username={username} 
                shouldStart={isGarageComplete} 
              />
              {syncing && (
                <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  <span>Syncing...</span>
                </div>
              )}
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center space-x-4">
              <Link
                href="/inventory"
                className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-gray-600 hover:border-yellow-400 text-yellow-400 font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Package className="h-4 w-4" />
                <span>Inventory</span>
              </Link>
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
              <button
                onClick={() => logout()}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">Total Vehicles in Inventory</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalVehiclesInInventory === 0 ? 'No inventory' : stats?.totalVehiclesInInventory || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-400 border-yellow-500">
                <Car className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">Total Vehicles Listed</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalVehiclesListed === 0 ? 'None listed' : stats?.totalVehiclesListed || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-300 border-yellow-400">
                <List className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">Total Vessels in Inventory</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalVesselsInInventory === 0 ? 'No inventory' : stats?.totalVesselsInInventory || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-500 border-yellow-600">
                <Ship className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">Total Vessels Listed</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalVesselsListed === 0 ? 'None listed' : stats?.totalVesselsListed || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-400 border-yellow-500">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">Total Possible Commission</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalPossibleCommission === 0 ? 'No commission' : formatCurrency(stats?.totalPossibleCommission || 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-400 border-yellow-500">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">Average Commission</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.averageCommission === 0 ? 'No data' : formatCurrency(stats?.averageCommission || 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-300 border-yellow-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">Average Vehicle Price</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.averageVehiclePrice === 0 ? 'No vehicles' : formatCurrency(stats?.averageVehiclePrice || 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-500 border-yellow-600">
                <Car className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">Average Vessel Price</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.averageVesselPrice === 0 ? 'No vessels' : formatCurrency(stats?.averageVesselPrice || 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-400 border-yellow-500">
                <Ship className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Inventory Additions Trend</h3>
                <BarChart3 className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="h-64">
                <SalesChart stats={stats || undefined} vehicles={vehicles} vessels={vessels} />
              </div>
            </div>
          </div>
          <div>
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Inventory Overview</h3>
                <Package className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="h-64">
                <InventoryChart stats={stats || undefined} />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Inventory Value</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalInventoryValue === 0 ? 'No inventory' : formatCurrency(stats?.totalInventoryValue || 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-400 border-yellow-500">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Listed Inventory Value</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.listedInventoryValue === 0 ? 'None listed' : formatCurrency(stats?.listedInventoryValue || 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-300 border-yellow-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Commission Rate</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.commissionPercentage === 0 ? 'No data' : `${(stats?.commissionPercentage || 0).toFixed(1)}%`}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-yellow-500 border-yellow-600">
                <Percent className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Lifetime Earnings</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.lifetimeEarnings === 0 ? 'No sales yet' : formatCurrency(stats?.lifetimeEarnings || 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg border bg-dark-700 text-green-400 border-green-500">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}