"use client";
import React, { useState } from 'react';
import { CustomeButton } from '@/components/ui/CustomeButton';
import SpendingChart from '@/components/shopping-history/SpendingChart';
import { Button } from '@/components/ui/button';
import FrequencyTracker from '@/components/shopping-history/FrequencyTracker';
import CategoryBreakdown from '@/components/shopping-history/CategoryBreakdown';
import HistoryList from '@/components/shopping-history/HistoryList';
import HistoryFilters from '@/components/shopping-history/HistoryFilters';
import HistoryStats from '@/components/shopping-history/HistoryStats';

interface TripItem {
  id: number;
  name: string;
  category: string;
  quantity: string;
  price: number;
  image: string;
  imageAlt: string;
}

interface Trip {
  id: string;
  date: string;
  store: string;
  storeImage: string;
  storeImageAlt: string;
  total: number;
  itemCount: number;
  duration: string;
  items: TripItem[];
  paymentMethod: string;
  savings: number;
}

const ShoppingHistory = () => {
  const [activeView, setActiveView] = useState('timeline');
  const [chartType, setChartType] = useState('bar');
  const [showFilters, setShowFilters] = useState(false);

  // Mock statistics data
  // const statsData = {
  //   totalTrips: 47,
  //   totalSpent: 2847,
  //   avgPerTrip: 60.57,
  //   totalItems: 892
  // };

  // Add mock data for components
  const mockSpendingData = [
    { month: 'Jan', spending: 450, trips: 8 },
    { month: 'Feb', spending: 380, trips: 7 },
    { month: 'Mar', spending: 520, trips: 9 }
  ];

  // const mockFrequentItems = [
  //   { name: 'Milk', frequency: 15, lastBought: '2024-01-15' },
  //   { name: 'Bread', frequency: 12, lastBought: '2024-01-14' }
  // ];

  // const mockCategoryData = [
  //   { category: 'Groceries', amount: 1200, percentage: 65 },
  //   { category: 'Household', amount: 400, percentage: 20 }
  // ];



  const viewOptions = [
    { id: 'timeline', label: 'Timeline View', icon: 'Calendar' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'frequency', label: 'Frequency', icon: 'Repeat' },
    { id: 'categories', label: 'Categories', icon: 'PieChart' }
  ];

  const handleFilterChange = (filter: string) => {
    console.log('Filter changed:', filter);
  };

  const handleSearch = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
  };

  const handleReorder = (items: Trip[] | TripItem[]) => {
    console.log('Reordering items:', items);
    // Here you would typically add items to the active shopping list
  };

  const renderContent = () => {
    switch (activeView) {
      case 'analytics':
        return (
          <div className="space-y-6">
            <SpendingChart chartType={chartType as 'bar' | 'line'} data={mockSpendingData} />
            <div className="flex justify-center">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                  className="rounded-md"
                >
                  Bar Chart
                </Button>
                <Button
                  variant={chartType === 'line' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('line')}
                  className="rounded-md"
                >
                  Line Chart
                </Button>
              </div>
            </div>
          </div>
        );

      case 'frequency':
        return <FrequencyTracker />;

      case 'categories':
        return <CategoryBreakdown />;

      default:
        return <HistoryList onReorder={handleReorder} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="flex">
        {/* Sidebar Filters */}
        <div className={`fixed left-0 top-16 bottom-0 w-80 bg-surface border-r border-border transform transition-transform duration-300 z-40 ${showFilters ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:w-80`}>
          <div className="h-full overflow-y-auto p-6">
            {showFilters ?? (
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
                <CustomeButton
                  variant="ghost"
                  size="icon"
                  iconName="X"
                  onClick={() => setShowFilters(false)}
                />
              </div>
            )
            }

            <HistoryFilters
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Shopping History</h1>
                <p className="text-text-secondary">
                  Track your purchases, analyze spending patterns, and reorder favorites
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <CustomeButton
                  variant="outline"
                  iconName="Filter"
                  iconPosition="left"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  Filters
                </CustomeButton>
                <CustomeButton
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </CustomeButton>
                <CustomeButton
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                >
                  New List
                </CustomeButton>
              </div>
            </div>

            {/* Statistics */}
            <div className="mb-8">
              <HistoryStats />
            </div>

            {/* View Toggle */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {viewOptions?.map((option) => (
                  <CustomeButton
                    key={option?.id}
                    variant={activeView === option?.id ? 'default' : 'outline'}
                    size="sm"
                    iconName={option?.icon}
                    iconPosition="left"
                    onClick={() => setActiveView(option?.id)}
                  >
                    {option?.label}
                  </CustomeButton>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
              {renderContent()}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 p-6 bg-linear-to-r from-brand-primary/5 to-brand-secondary/5 rounded-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Smart Shopping Insights
                  </h3>
                  <p className="text-text-secondary">
                    Based on your history, you typically shop every 4-5 days and save 12% with smart planning.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <CustomeButton
                    variant="outline"
                    iconName="Calendar"
                    iconPosition="left"
                  >
                    Plan Next Trip
                  </CustomeButton>
                  <CustomeButton
                    variant="default"
                    iconName="Sparkles"
                    iconPosition="left"
                  >
                    Get Suggestions
                  </CustomeButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-xs z-30"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default ShoppingHistory;