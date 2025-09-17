import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface LiveDataIndicatorProps {
  isConnected: boolean;
  exchange: string;
  data?: any;
  error?: string | null;
}

const LiveDataIndicator: React.FC<LiveDataIndicatorProps> = ({ 
  isConnected, 
  exchange, 
  data, 
  error 
}) => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (data && isConnected) {
      setLastUpdate(new Date());
    }
  }, [data, isConnected]);

  const getStatusColor = () => {
    if (error) return 'border-red-500 text-red-500';
    if (isConnected) return 'border-terminal-green text-terminal-green';
    return 'border-yellow-500 text-yellow-500';
  };

  const getStatusText = () => {
    if (error) return 'Ошибка';
    if (isConnected) return 'Live';
    return 'Подключение...';
  };

  const getStatusIcon = () => {
    if (error) return 'AlertCircle';
    if (isConnected) return 'Wifi';
    return 'Loader2';
  };

  return (
    <div className="flex items-center space-x-3">
      <Badge 
        variant="outline" 
        className={`${getStatusColor()} transition-colors`}
      >
        <div className="flex items-center space-x-2">
          <Icon 
            name={getStatusIcon()} 
            size={14} 
            className={`${!isConnected && !error ? 'animate-spin' : ''}`} 
          />
          <span>{exchange} {getStatusText()}</span>
        </div>
      </Badge>

      {isConnected && !error && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
          <span className="text-xs text-gray-400">
            {lastUpdate && (
              <>Обновлено {lastUpdate.toLocaleTimeString('ru-RU')}</>
            )}
          </span>
        </div>
      )}

      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
};

export default LiveDataIndicator;