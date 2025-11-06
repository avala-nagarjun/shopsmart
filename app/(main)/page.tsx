"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import { useAuth } from '@/context/AuthProvider';
import QuickActions from '@/components/dashboard/QuickActions';
import ActiveListsCard from '@/components/dashboard/ActiveListsCard';
import SmartSuggestions from '@/components/dashboard/SmartSuggestions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import FamilyActivity from '@/components/dashboard/FamilyActivity';
import InsightsCard from '@/components/dashboard/InsightsCard';
import { useDashboard } from "@/hooks/useDashboard";

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { data, loading: dataLoading } = useDashboard()
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (authLoading) return <div className="p-8 text-gray-600">Loading...</div>;

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <WelcomeHeader
          name={user.name || data?.user.name}
          loading={dataLoading}
          activeListsCount={data?.stats.activeListsCount}
          avgTripTime={data?.stats.avgTripTime}
          thisWeekSpendings={data?.stats.thisWeekSpendings}
          logout={logout}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Active Lists */}
          <div className="lg:col-span-2">
            <ActiveListsCard activeLists={data?.activeLists} loading={dataLoading} />
          </div>

          {/* Right Column - Smart Suggestions */}
          <div className="lg:col-span-1">
            <SmartSuggestions suggestions={data?.smartSuggestions} loading={dataLoading} />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <RecentActivity activities={data?.recentActivities} loading={dataLoading} />

          {/* Family Activity */}
          <FamilyActivity familyMembers={data?.familyMembers} loading={dataLoading} />
        </div>

        {/* Insights Section */}
        <InsightsCard insights={data?.insights} loading={dataLoading} />
      </div>
    </div>
  );
};

export default Dashboard;