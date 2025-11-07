import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { formatCurrency } from '@/lib/currency';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomeButton } from '@/components/ui/CustomeButton';
import { useCurrency } from '@/context/currencyProvider';

interface ShoppingItemProps {
    item?: {
        id?: string;
        name: string;
        completed: boolean;
        quantity?: number;
        unit?: string;
        priority?: 'low' | 'medium' | 'high';
        addedBy?: string;
        brand?: string;
        estimatedPrice?: number;
        note?: string;
    };
    categoryColor: string;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onNote: () => void;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({
    item,
    onToggle,
    onEdit,
    onDelete,
    onNote
}) => {
    const [isSwipeOpen, setIsSwipeOpen] = useState(false);
    const { selectedCurrency } = useCurrency();

    const handleSwipeToggle = () => {
        setIsSwipeOpen(!isSwipeOpen);
    };

    const getPriorityColor = (priority?: 'low' | 'medium' | 'high'): string => {
        switch (priority) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getPriorityIcon = (priority?: 'low' | 'medium' | 'high'): string => {
        switch (priority) {
            case 'high': return 'AlertTriangle';
            case 'medium': return 'Clock';
            default: return 'Empty';
        }
    };

    return (
        <div className="relative">
            {/* Main Item Content */}
            <div className={`flex items-center p-4 hover:bg-muted/30 calm-transition ${item?.completed ? 'opacity-60' : ''} ${isSwipeOpen ? 'bg-muted/50' : ''}`}>
                {/* Checkbox */}
                <div className="mr-4">
                    <Checkbox
                        checked={item?.completed}
                        onCheckedChange={onToggle}
                        className="scale-110"
                    />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`
              font-medium truncate
              ${item?.completed ? 'line-through text-gray-500' : 'text-primary'}
            `}>
                            {item?.name}
                        </h4>

                        {item?.priority !== 'low' && item?.priority && (
                            <Icon
                                name={getPriorityIcon(item?.priority)}
                                size={14}
                                className={getPriorityColor(item?.priority)}
                            />
                        )}

                        {item?.addedBy && (
                            <span className="text-xs text-gray-600 bg-muted px-2 py-0.5 rounded-full">
                                {item?.addedBy}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <span className="font-medium">{item?.quantity} {item?.unit}</span>

                        {item?.brand && (
                            <span>Brand: {item?.brand}</span>
                        )}

                        {item?.estimatedPrice && (
                            <span className="font-semibold text-text-primary">
                                {formatCurrency(item?.estimatedPrice, selectedCurrency)}
                            </span>
                        )}
                    </div>

                    {item?.note && (
                        <p className="text-sm text-text-secondary mt-1 italic">
                            &quot;{item?.note}&quot;
                        </p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-1 ml-4">
                    {item?.note && (
                        <Icon name="MessageSquare" size={16} className="text-brand-primary" />
                    )}

                    <CustomeButton
                        variant="ghost"
                        size="icon"
                        iconName="MoreVertical"
                        onClick={handleSwipeToggle}
                        className="text-text-secondary hover:text-text-primary"
                    />
                </div>
            </div>

            {/* Swipe Actions Panel */}
            {isSwipeOpen && (
                <div className="absolute right-0 top-0 bottom-0 flex items-center bg-surface border-l border-border shadow-gentle z-10">
                    <div className="flex items-center space-x-1 px-2">
                        <CustomeButton
                            variant="ghost"
                            size="icon"
                            iconName="MessageSquare"
                            onClick={() => {
                                onNote();
                                setIsSwipeOpen(false);
                            }}
                            className="text-brand-primary hover:bg-brand-primary/10"
                        />

                        <CustomeButton
                            variant="ghost"
                            size="icon"
                            iconName="Edit2"
                            onClick={() => {
                                onEdit();
                                setIsSwipeOpen(false);
                            }}
                            className="text-text-secondary hover:text-text-primary hover:bg-muted"
                        />

                        <CustomeButton
                            variant="ghost"
                            size="icon"
                            iconName="Trash2"
                            onClick={() => {
                                onDelete();
                                setIsSwipeOpen(false);
                            }}
                            className="text-error hover:bg-error/10"
                        />
                    </div>
                </div>
            )}

            {/* Overlay to close swipe panel */}
            {isSwipeOpen && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setIsSwipeOpen(false)}
                />
            )}
        </div>
    );
};

export default ShoppingItem;