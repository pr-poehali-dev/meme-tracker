import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickData, IChartApi, ISeriesApi } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TradingChartProps {
  symbol: string;
  exchange: string;
  onTimeframeChange?: (timeframe: string) => void;
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  symbol = 'DOGE/USDT', 
  exchange = 'MEXC',
  onTimeframeChange 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  
  const [timeframe, setTimeframe] = useState('1h');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0.08234);
  const [priceChange, setPriceChange] = useState(-1.23);
  const [volume24h, setVolume24h] = useState('125.5M');
  const [rsi, setRsi] = useState(64.2);

  // Generate realistic candlestick data
  const generateCandlestickData = (count: number = 100): CandleData[] => {
    const data: CandleData[] = [];
    let basePrice = 0.08000;
    const now = Math.floor(Date.now() / 1000);
    const timeframeSeconds = getTimeframeSeconds(timeframe);
    
    for (let i = count; i >= 0; i--) {
      const time = now - (i * timeframeSeconds);
      
      // Add some realistic price movement
      const volatility = 0.002;
      const trend = Math.sin(i / 10) * 0.0001;
      const randomChange = (Math.random() - 0.5) * volatility;
      
      const open = basePrice;
      const close = open + trend + randomChange;
      const high = Math.max(open, close) + Math.random() * 0.0005;
      const low = Math.min(open, close) - Math.random() * 0.0005;
      const volume = Math.random() * 1000000 + 500000;
      
      data.push({
        time,
        open,
        high,
        low,
        close,
        volume
      });
      
      basePrice = close;
    }
    
    return data;
  };

  const getTimeframeSeconds = (tf: string): number => {
    const timeframes: Record<string, number> = {
      '1m': 60,
      '5m': 300,
      '15m': 900,
      '1h': 3600,
      '4h': 14400,
      '1d': 86400
    };
    return timeframes[tf] || 3600;
  };

  const initializeChart = () => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'hsl(214 32% 8%)' },
        textColor: 'hsl(0 0% 98%)',
      },
      grid: {
        vertLines: { color: 'hsl(217 32% 18%)' },
        horzLines: { color: 'hsl(217 32% 18%)' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: 'hsl(217 32% 18%)',
        textColor: 'hsl(0 0% 98%)',
      },
      timeScale: {
        borderColor: 'hsl(217 32% 18%)',
        textColor: 'hsl(0 0% 98%)',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: 'hsl(160 100% 42%)',
      downColor: 'hsl(0 100% 67%)',
      borderUpColor: 'hsl(160 100% 42%)',
      borderDownColor: 'hsl(0 100% 67%)',
      wickUpColor: 'hsl(160 100% 42%)',
      wickDownColor: 'hsl(0 100% 67%)',
    });

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: 'hsl(217 32% 25%)',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Load initial data
    loadChartData();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  };

  const loadChartData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const candleData = generateCandlestickData(200);
      
      if (candlestickSeriesRef.current && volumeSeriesRef.current) {
        // Convert to chart format
        const chartData: CandlestickData[] = candleData.map(candle => ({
          time: candle.time as any,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));

        const volumeData = candleData.map(candle => ({
          time: candle.time as any,
          value: candle.volume,
          color: candle.close >= candle.open ? 'hsl(160 100% 42% / 0.8)' : 'hsl(0 100% 67% / 0.8)',
        }));

        candlestickSeriesRef.current.setData(chartData);
        volumeSeriesRef.current.setData(volumeData);

        // Update current price info
        const lastCandle = candleData[candleData.length - 1];
        setCurrentPrice(lastCandle.close);
        
        const firstCandle = candleData[0];
        const change = ((lastCandle.close - firstCandle.close) / firstCandle.close) * 100;
        setPriceChange(change);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    onTimeframeChange?.(newTimeframe);
    loadChartData();
  };

  useEffect(() => {
    const cleanup = initializeChart();
    return cleanup;
  }, []);

  useEffect(() => {
    loadChartData();
  }, [timeframe, symbol, exchange]);

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
              onClick={loadChartData}
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
          <div 
            ref={chartContainerRef} 
            className="w-full h-80 rounded-lg border border-terminal-border"
          />
          
          {isLoading && (
            <div className="absolute inset-0 bg-terminal-bg/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="Loader2" size={32} className="text-terminal-green mx-auto mb-2 animate-spin" />
                <p className="text-gray-400">Загрузка данных...</p>
              </div>
            </div>
          )}
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