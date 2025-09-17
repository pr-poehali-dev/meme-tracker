import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TradingChartProps {
  symbol?: string;
  exchange?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  symbol = 'DOGE/USDT', 
  exchange = 'MEXC',
  onTimeframeChange 
}) => {
  const [timeframe, setTimeframe] = useState('1h');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice] = useState(0.08234);
  const [priceChange] = useState(-1.23);
  const [volume24h] = useState('125.5M');
  const [rsi] = useState(64.2);

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toFixed(8);
    if (price < 1) return price.toFixed(6);
    return price.toFixed(4);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <Card className="bg-terminal-card border-terminal-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Icon name="TrendingUp" size={20} className="mr-2 text-terminal-green" />
            График {symbol}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-20 bg-terminal-bg border-terminal-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1м</SelectItem>
                <SelectItem value="5m">5м</SelectItem>
                <SelectItem value="15m">15м</SelectItem>
                <SelectItem value="1h">1ч</SelectItem>
                <SelectItem value="4h">4ч</SelectItem>
                <SelectItem value="1d">1д</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTimeframeChange(timeframe)}
              disabled={isLoading}
              className="border-terminal-border hover:bg-terminal-bg"
            >
              <Icon name="RefreshCw" size={16} className={isLoading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Container */}
        <div className="relative">
          <div className="w-full h-80 rounded-lg border border-terminal-border bg-terminal-bg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {/* Candlestick simulation */}
              <div className="flex items-end justify-center h-full px-4 space-x-1">
                {Array.from({ length: 50 }).map((_, i) => {
                  const height = Math.random() * 60 + 20;
                  const isGreen = Math.random() > 0.5;
                  return (
                    <div
                      key={i}
                      className={`w-2 ${isGreen ? 'bg-terminal-green' : 'bg-terminal-red'} opacity-60`}
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </div>
            
            {isLoading && (
              <div className="absolute inset-0 bg-terminal-bg/80 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Icon name="Loader2" size={32} className="text-terminal-green mx-auto mb-2 animate-spin" />
                  <p className="text-gray-400">Загрузка данных...</p>
                </div>
              </div>
            )}
            
            {!isLoading && (
              <div className="text-center z-10">
                <Icon name="TrendingUp" size={48} className="text-terminal-green mx-auto mb-2" />
                <p className="text-gray-400">Интерактивный график</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Price Info */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Цена</p>
            <p className="text-xl font-mono text-white">${formatPrice(currentPrice)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Изменение 24ч</p>
            <p className={`text-lg font-mono ${priceChange >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
              {formatChange(priceChange)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Объём 24ч</p>
            <p className="text-lg font-mono text-white">{volume24h}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">RSI</p>
            <p className={`text-lg font-mono ${rsi > 70 ? 'text-terminal-red' : rsi < 30 ? 'text-terminal-green' : 'text-white'}`}>
              {rsi.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Trading Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Биржа:</span>
            <span className="text-white font-semibold">{exchange}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              <span className="text-green-400 text-sm">Live</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingChart;