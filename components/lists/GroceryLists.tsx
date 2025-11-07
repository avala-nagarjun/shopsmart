"use client";
import React from 'react';
import Icon from '@/components/AppIcon';
import { CustomeButton } from '@/components/ui/CustomeButton';
import { ShoppingList } from '@/types/all';

interface GroceryListsProps {
    selectedListId: string;
    list: ShoppingList[]
    loading?: boolean
    creating?: boolean
    onListSelect: (listId: string) => void;
    onAddList: () => void;
}

const GroceryLists: React.FC<GroceryListsProps> = ({ selectedListId, loading = false, creating = false, list, onListSelect, onAddList }) => {
    const activeLists = list.filter(list => list.status === 'active');

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Icon name="ShoppingCart" size={20} color="white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-text-primary">Active Lists</h1>
                        <p className="text-sm text-gray-400">Select a list to view details</p>
                    </div>
                </div>

                <CustomeButton
                    variant="outline"
                    iconName="Plus"
                    onClick={onAddList}
                    className="w-full mb-4"
                >
                    Add New List
                </CustomeButton>

                {(loading || creating) ? (
                    <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-full flex items-start space-x-3 p-4 rounded-lg bg-muted/50 animate-pulse"
                            >
                                <div className="w-5 h-5 bg-gray-300 rounded mt-0.5 shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded mb-1"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activeLists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Icon name="List" size={48} className="text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No active lists</h3>
                        <p className="text-sm text-gray-500">Create a new list to get started</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {activeLists.map((list) => (
                            <button
                                key={list.id}
                                onClick={() => onListSelect(list.id)}
                                className={`
                                    w-full flex items-start space-x-3 p-4 rounded-lg text-left calm-transition
                                    ${selectedListId === list.id
                                        ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:text-text-primary hover:bg-muted/50'
                                    }
                                `}
                            >
                                <Icon
                                    name="List"
                                    size={20}
                                    className={`mt-0.5 shrink-0 ${selectedListId === list.id ? 'text-primary' : 'text-current'
                                        }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium">{list.name}</div>
                                    <div className="text-sm opacity-70 mt-0.5">{list.description}</div>
                                    <div className="text-xs opacity-50 mt-1">Items: {list?.items?.length ?? 0}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroceryLists;
