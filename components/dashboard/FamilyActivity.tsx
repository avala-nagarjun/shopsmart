"use client";

import React from "react";
import Icon from "@/components/AppIcon";
import { CustomeButton } from "@/components/ui/CustomeButton";
import Link from "next/link";
// import AppImage from "../AppImage";

interface FamilyActivityProps {
    familyMembers?: {
        id: string;
        name: string;
        email: string;
        status: string;
    }[]
    loading?: boolean
}

const FamilyActivity = ({ familyMembers, loading = false }: FamilyActivityProps) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online":
                return "bg-success";
            case "offline":
                return "bg-gray-400";
            default:
                return "bg-gray-400";
        }
    };

    if (loading) {
        return (
            <div className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Icon name="Users" size={20} className="text-blue-600" />
                        <h2 className="text-lg font-semibold text-primary">
                            Family Activity
                        </h2>
                    </div>
                    <Link href="/family-hub">
                        <CustomeButton
                            variant="ghost"
                            size="sm"
                            iconName="UserPlus"
                            iconPosition="left"
                        >
                            Invite
                        </CustomeButton>
                    </Link>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-4 p-3">
                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-48 mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-32"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="Users" size={20} className="text-blue-600" />
                    <h2 className="text-lg font-semibold text-primary">
                        Family Activity
                    </h2>
                </div>
                <Link href="/family-hub">
                    <CustomeButton
                        variant="ghost"
                        size="sm"
                        iconName="UserPlus"
                        iconPosition="left"
                    >
                        Invite
                    </CustomeButton>
                </Link>
            </div>
            <div className="space-y-4">
                {familyMembers?.length === 0 ? (
                    <div className="text-center py-8">
                        <Icon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No family members yet</p>
                        <Link href="/family-hub">
                            <CustomeButton variant="outline" size="sm" iconName="UserPlus" iconPosition="left" className="mt-2">
                                Invite family members
                            </CustomeButton>
                        </Link>
                    </div>
                ) : (
                    familyMembers?.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center space-x-4 p-3 breathing-card hover:bg-muted/30 rounded-lg calm-transition"
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {member.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <div
                                    className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                                        member.status
                                    )} rounded-full border-2 border-surface`}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-bold text-primary">
                                        {member.name}
                                    </h3>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${member.status === "online"
                                            ? "bg-success/10 text-success"
                                            : "bg-gray-500/10 text-gray-500"
                                            }`}
                                    >
                                        {member.status}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 mb-1">
                                    {member.email}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {familyMembers?.length} family member{familyMembers?.length !== 1 ? 's' : ''}
                    </div>
                    <Link href="/family-hub">
                        <CustomeButton
                            variant="outline"
                            size="sm"
                            iconName="Users"
                            iconPosition="left"
                        >
                            Manage Family
                        </CustomeButton>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FamilyActivity;
