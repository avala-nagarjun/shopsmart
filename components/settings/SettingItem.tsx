import React from 'react';
import Icon from '@/components/AppIcon';

interface SettingItemType {
  label: string;
  description: string;
  value?: string | boolean;
  icon?: string;
  action?: React.ReactNode;
  showArrow?: boolean;
  className?: string;
  onClick?: () => void;

}

const SettingItem = ({
  label,
  description,
  value,
  icon,
  action,
  showArrow = false,
  className = "",
  onClick
}: SettingItemType) => {
  const isClickable = onClick || showArrow;

  return (
    <div
      className={`
        flex items-center justify-between p-4 rounded-lg border border-border/50 
        ${isClickable ? 'hover:bg-muted/50 cursor-pointer calm-transition' : 'bg-muted/20'}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {icon && (
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Icon name={icon} size={16} className="text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-text-primary">{label}</div>
          {description && (
            <div className="text-sm text-text-secondary mt-0.5">{description}</div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {value && (
          <span className="text-sm text-text-secondary font-medium">{value}</span>
        )}
        {action && action}
        {showArrow && (
          <Icon name="ChevronRight" size={16} className="text-text-secondary" />
        )}
      </div>
    </div>
  );
};

export default SettingItem;