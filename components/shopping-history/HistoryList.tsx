"use client";
import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';
import Image from '@/components/AppImage';
import { formatCurrency } from '@/lib/currency';

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

interface HistoryListProps {
  trips?: Trip[];
  onReorder?: (items: Trip[] | TripItem[]) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ trips, onReorder }) => {
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

  const mockTrips = trips ?? [
    {
      id: 'trip-001',
      date: '2024-10-12',
      store: 'Walmart Supercenter',
      storeImage: "https://images.unsplash.com/photo-1499217960377-94dba34c3cd8",
      storeImageAlt: 'Modern Walmart store exterior with blue and yellow signage during daytime',
      total: 127.45,
      itemCount: 18,
      duration: '45 min',
      items: [
        { id: 1, name: 'Organic Bananas', category: 'Produce', quantity: '2 lbs', price: 3.98, image: "https://images.unsplash.com/photo-1565804212260-280f967e431b", imageAlt: 'Fresh yellow bananas in a bunch on white background' },
        { id: 2, name: 'Whole Milk', category: 'Dairy', quantity: '1 gallon', price: 4.29, image: "https://images.unsplash.com/photo-1735493234230-f75f13e0d3db", imageAlt: 'White plastic milk jug with blue cap on clean background' },
        { id: 3, name: 'Bread - Whole Wheat', category: 'Bakery', quantity: '1 loaf', price: 2.89, image: "https://images.unsplash.com/photo-1596662841962-34034e1e6efc", imageAlt: 'Sliced whole wheat bread loaf on wooden cutting board' },
        { id: 4, name: 'Ground Beef 80/20', category: 'Meat', quantity: '2 lbs', price: 12.98, image: "https://images.unsplash.com/photo-1617813833669-8ad4397b9239", imageAlt: 'Fresh ground beef in clear plastic packaging on white surface' }],

      paymentMethod: 'Credit Card',
      savings: 15.20
    },
    {
      id: 'trip-002',
      date: '2024-10-09',
      store: 'Target',
      storeImage: "https://images.unsplash.com/photo-1607016552642-b667f4a0a4e2",
      storeImageAlt: 'Target store front with red bullseye logo and modern glass entrance',
      total: 89.32,
      itemCount: 12,
      duration: '32 min',
      items: [
        { id: 5, name: 'Greek Yogurt', category: 'Dairy', quantity: '4 cups', price: 5.99, image: "https://images.unsplash.com/photo-1570649857669-4ad9f896435d", imageAlt: 'White plastic containers of Greek yogurt stacked on refrigerated shelf' },
        { id: 6, name: 'Chicken Breast', category: 'Meat', quantity: '3 lbs', price: 18.75, image: "https://images.unsplash.com/photo-1682991136736-a2b44623eeba", imageAlt: 'Fresh raw chicken breast fillets on white butcher paper' },
        { id: 7, name: 'Spinach - Baby', category: 'Produce', quantity: '5 oz bag', price: 3.49, image: "https://images.unsplash.com/photo-1518008147256-2f83e826c536", imageAlt: 'Fresh baby spinach leaves in clear plastic container' }],

      paymentMethod: 'Debit Card',
      savings: 8.45
    },
    {
      id: 'trip-003',
      date: '2024-10-05',
      store: 'Kroger',
      storeImage: "https://images.unsplash.com/photo-1611154379317-339daf919a9a",
      storeImageAlt: 'Kroger grocery store exterior with blue and white signage and shopping carts',
      total: 156.78,
      itemCount: 24,
      duration: '58 min',
      items: [
        { id: 8, name: 'Salmon Fillet', category: 'Seafood', quantity: '1.5 lbs', price: 24.99, image: "https://images.unsplash.com/photo-1673767413856-2cfc082c7ea5", imageAlt: 'Fresh salmon fillet with pink flesh on ice display' },
        { id: 9, name: 'Avocados', category: 'Produce', quantity: '6 count', price: 7.94, image: "https://images.unsplash.com/photo-1728365796061-c6431c027687", imageAlt: 'Six ripe avocados with dark green bumpy skin arranged on wooden surface' },
        { id: 10, name: 'Pasta - Penne', category: 'Pantry', quantity: '2 boxes', price: 4.58, image: "https://images.unsplash.com/photo-1669295889162-8b64f3d1aed7", imageAlt: 'Dried penne pasta tubes scattered on white marble surface' }],

      paymentMethod: 'Credit Card',
      savings: 22.15
    }];


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleExpanded = (tripId: string) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  const handleReorderTrip = (trip: Trip) => {
    onReorder?.([trip]);
  };

  const handleReorderItem = (item: TripItem) => {
    onReorder?.([item]);
  };

  return (
    <div className="space-y-4">
      {mockTrips?.map((trip) =>
        <div key={trip?.id} className="breathing-card bg-card rounded-lg border border-border overflow-hidden">
          {/* Trip Header */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={trip?.storeImage}
                    alt={trip?.storeImageAlt}
                    className="w-full h-full object-cover" />

                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{trip?.store}</h3>
                  <p className="text-sm text-text-secondary">{formatDate(trip?.date)}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(trip?.total)}</p>
                <p className="text-sm text-text-secondary">{trip?.itemCount} items</p>
              </div>
            </div>

            {/* Trip Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Icon name="Clock" size={20} className="text-text-secondary mx-auto mb-1" />
                <p className="text-sm font-medium text-text-primary">{trip?.duration}</p>
                <p className="text-xs text-text-secondary">Duration</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Icon name="CreditCard" size={20} className="text-text-secondary mx-auto mb-1" />
                <p className="text-sm font-medium text-text-primary">{trip?.paymentMethod}</p>
                <p className="text-xs text-text-secondary">Payment</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Icon name="Percent" size={20} className="text-green-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-600">${trip?.savings}</p>
                <p className="text-xs text-green-600">Saved</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <CustomeButton
                variant="default"
                size="sm"
                iconName="RotateCcw"
                iconPosition="left"
                onClick={() => handleReorderTrip(trip)}>

                Reorder All
              </CustomeButton>
              <CustomeButton
                variant="outline"
                size="sm"
                iconName={expandedTrip === trip?.id ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
                onClick={() => toggleExpanded(trip?.id)}>

                {expandedTrip === trip?.id ? 'Hide' : 'View'} Items
              </CustomeButton>
              <CustomeButton
                variant="ghost"
                size="sm"
                iconName="Share"
                iconPosition="left">

                Share
              </CustomeButton>
            </div>
          </div>

          {/* Expanded Items List */}
          {expandedTrip === trip?.id &&
            <div className="border-t border-border bg-muted/30">
              <div className="p-6">
                <h4 className="font-medium text-text-primary mb-4">Items Purchased</h4>
                <div className="space-y-3">
                  {trip?.items?.map((item) =>
                    <div key={item?.id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item?.image}
                            alt={item?.imageAlt}
                            className="w-full h-full object-cover" />

                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{item?.name}</p>
                          <p className="text-sm text-text-secondary">{item?.category} • {item?.quantity}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-text-primary">${item?.price}</span>
                        <CustomeButton
                          variant="ghost"
                          size="sm"
                          iconName="Plus"
                          onClick={() => handleReorderItem(item)}
                          className="text-brand-primary hover:text-brand-primary">

                          Add
                        </CustomeButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        </div>
      )}
      {/* Load More */}
      <div className="text-center py-8">
        <CustomeButton
          variant="outline"
          iconName="ChevronDown"
          iconPosition="right">

          Load More History
        </CustomeButton>
      </div>
    </div>);

};

export default HistoryList;