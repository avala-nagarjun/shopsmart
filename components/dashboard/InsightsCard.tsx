import React from "react";
import Icon from "@/components/AppIcon";
import { formatCurrency } from "@/lib/currency";
import { CustomeButton } from "@/components/ui/CustomeButton";
import Link from "next/link";

interface InsightsCardProps {
    insights?: {
        savings: { value: number; change: string };
        spendingTrend: { value: number; change: string };
        tip: string;
    }
    loading?: boolean
}

const InsightsCard = ({ insights, loading = false }: InsightsCardProps) => {

    const insightsData = insights ? [
        {
            type: "savings",
            title: "Great Savings This Week!",
            description: `You saved ${formatCurrency(insights.savings.value)} by using coupons and buying sale items`,
            value: formatCurrency(insights.savings.value),
            change: insights.savings.change,
            changeType: insights.savings.change.startsWith('+') ? "positive" : "negative",
            icon: "PiggyBank",
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
            action: "View Details",
        },
        {
            type: "trend",
            title: "Spending Trend Alert",
            description: `Your grocery spending changed by ${insights.spendingTrend.change} this month`,
            value: formatCurrency(insights.spendingTrend.value),
            change: insights.spendingTrend.change,
            changeType: insights.spendingTrend.change.startsWith('+') ? "positive" : "negative",
            icon: "TrendingDown",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
            action: "See Breakdown",
        },
        {
            type: "recommendation",
            title: "Smart Shopping Tip",
            description: insights.tip,
            value: "Tuesday Mornings",
            change: "Save More",
            changeType: "neutral",
            icon: "Lightbulb",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            action: "Learn More",
        },
    ] : [];

    const weeklyTips = [
        {
            id: 1,
            tip: "You shop most efficiently on Tuesday mornings",
            icon: "TrendingUp",
            actionable: true,
        },
        {
            id: 2,
            tip: "Consider buying milk in larger quantities",
            icon: "Lightbulb",
            actionable: true,
        },
        {
            id: 3,
            tip: "Your produce purchases peak on Sundays",
            icon: "Calendar",
            actionable: false,
        },
    ];

    const getChangeColor = (changeType: string) => {
        switch (changeType) {
            case "positive":
                return "text-emerald-500";
            case "negative":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Icon name="BarChart3" size={20} className="text-blue-500" />
                    <h2 className="text-lg font-semibold text-text-primary">
                        Shopping Insights
                    </h2>
                </div>
                <CustomeButton
                    variant="ghost"
                    size="sm"
                    iconName="TrendingUp"
                    iconPosition="left"
                >
                    Analytics
                </CustomeButton>
            </div>
            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-muted/30 rounded-lg p-4 text-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-16 mx-auto mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-12 mx-auto mb-1"></div>
                            <div className="h-3 bg-gray-300 rounded w-20 mx-auto"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {insightsData.map((insight) => (
                        <div
                            key={insight.type}
                            className="breathing-card bg-muted/30 rounded-lg p-4 text-center"
                        >
                            <div className="flex items-center justify-center mb-2">
                                <Icon
                                    name={insight.icon}
                                    size={28}
                                    className={`p-1 rounded-lg ${insight.bgColor} ${insight.color}`}
                                />
                            </div>
                            <div className="text-xl font-bold text-text-primary mb-1">
                                {insight.value}
                            </div>
                            <div
                                className={`text-sm font-medium mb-1 ${getChangeColor(
                                    insight.changeType
                                )}`}
                            >
                                {insight.change}
                            </div>
                            <div className="text-xs text-text-secondary">
                                {insight.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Weekly Tips */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                    Personalized Tips
                </h3>
                {weeklyTips?.map((tip) => (
                    <div
                        key={tip?.id}
                        className="flex items-start space-x-3 p-3 bg-blue-500/5 rounded-lg"
                    >
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <Icon name={tip?.icon} size={16} className="text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-primary">{tip?.tip}</p>
                            {tip?.actionable && (
                                <CustomeButton
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 text-xs h-6 px-2"
                                >
                                    Learn More
                                </CustomeButton>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Icon name="Calendar" size={16} />
                        <span>Data from last 30 days</span>
                    </div>
                    <Link href="/settings">
                        <CustomeButton variant="ghost" size="sm" iconName="Settings">
                            Preferences
                        </CustomeButton>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InsightsCard;
