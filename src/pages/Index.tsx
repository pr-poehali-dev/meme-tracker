import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedExchange, setSelectedExchange] = useState('MEXC');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [searchToken, setSearchToken] = useState('');

  // Mock data for demonstration
  const watchlistTokens = [
    { symbol: 'DOGE', price: 0.08234, change1h: 2.45, change24h: -1.23, volume: '125.5M' },
    { symbol: 'SHIB', price: 0.000008321, change1h: -0.87, change24h: 3.45, volume: '89.2M' },
    { symbol: 'PEPE', price: 0.00000145, change1h: 5.67, change24h: 12.34, volume: '67.8M' },
    { symbol: 'FLOKI', price: 0.000234, change1h: -2.14, change24h: -5.67, volume: '45.6M' },
    { symbol: 'BONK', price: 0.00001876, change1h: 1.23, change24h: 8.90, volume: '34.2M' },
  ];

  const marketTokens = [
    { symbol: 'DOGE', price: 0.08234, volume: '125.5M', change1h: 2.45, change24h: -1.23, spread: '0.02%' },
    { symbol: 'SHIB', price: 0.000008321, volume: '89.2M', change1h: -0.87, change24h: 3.45, spread: '0.03%' },
    { symbol: 'PEPE', price: 0.00000145, volume: '67.8M', change1h: 5.67, change24h: 12.34, spread: '0.05%' },
    { symbol: 'FLOKI', price: 0.000234, volume: '45.6M', change1h: -2.14, change24h: -5.67, spread: '0.04%' },
    { symbol: 'BONK', price: 0.00001876, volume: '34.2M', change1h: 1.23, change24h: 8.90, spread: '0.06%' },
    { symbol: 'WIF', price: 2.87, volume: '156.3M', change1h: 3.21, change24h: -2.45, spread: '0.01%' },
    { symbol: 'MYRO', price: 0.145, volume: '23.4M', change1h: -1.56, change24h: 7.89, spread: '0.07%' },
  ];

  const signals = [
    { type: 'pump', token: 'PEPE', trigger: '+5.67% в 1ч', time: '12:34' },
    { type: 'volume', token: 'WIF', trigger: 'Объём ↑ в 3.2 раза', time: '12:28' },
    { type: 'drop', token: 'FLOKI', trigger: '-5.67% за 24ч', time: '12:15' },
  ];

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
    <div className="min-h-screen bg-terminal-bg text-white font-sans">
      {/* Header */}
      <header className="border-b border-terminal-border bg-terminal-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-terminal-green">MemeDesk</h1>
            <nav className="hidden md:flex space-x-6">
              <button className="text-white hover:text-terminal-green transition-colors">Графики</button>
              <button className="text-gray-400 hover:text-terminal-green transition-colors">Таблица рынка</button>
              <button className="text-gray-400 hover:text-terminal-green transition-colors">Сигналы</button>
              <button className="text-gray-400 hover:text-terminal-green transition-colors">Лог бота</button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedExchange} onValueChange={setSelectedExchange}>
              <SelectTrigger className="w-32 bg-terminal-card border-terminal-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEXC">MEXC</SelectItem>
                <SelectItem value="Bitget">Bitget</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="border-terminal-green text-terminal-green">
              {selectedExchange} Подключен
            </Badge>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Search and Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 bg-terminal-card border-terminal-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">График DOGE/USDT</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mock Chart Area */}
              <div className="h-80 bg-terminal-bg rounded-lg border border-terminal-border flex items-center justify-center relative overflow-hidden">
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
                <div className="text-center z-10">
                  <Icon name="TrendingUp" size={48} className="text-terminal-green mx-auto mb-2" />
                  <p className="text-gray-400">График загружается...</p>
                </div>
              </div>
              
              {/* Price Info */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Цена</p>
                  <p className="text-xl font-mono text-white">$0.08234</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Изменение 24ч</p>
                  <p className="text-lg font-mono text-terminal-red">-1.23%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Объём 24ч</p>
                  <p className="text-lg font-mono text-white">125.5M</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">RSI</p>
                  <p className="text-lg font-mono text-terminal-green">64.2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Watchlist */}
          <div className="space-y-6">
            {/* Search */}
            <Card className="bg-terminal-card border-terminal-border">
              <CardHeader>
                <CardTitle className="text-white">Поиск токена</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Введите символ токена..."
                    value={searchToken}
                    onChange={(e) => setSearchToken(e.target.value)}
                    className="pl-10 bg-terminal-bg border-terminal-border text-white"
                  />
                </div>
                <Button className="w-full mt-3 bg-terminal-green hover:bg-terminal-green/80 text-terminal-bg">
                  Найти токен
                </Button>
              </CardContent>
            </Card>

            {/* Watchlist */}
            <Card className="bg-terminal-card border-terminal-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Icon name="Star" size={20} className="mr-2 text-terminal-green" />
                  Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {watchlistTokens.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-2 rounded bg-terminal-bg border border-terminal-border hover:border-terminal-green transition-colors cursor-pointer">
                      <div>
                        <p className="font-semibold text-white">{token.symbol}</p>
                        <p className="text-sm font-mono text-gray-400">${formatPrice(token.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-mono ${token.change1h >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                          {formatChange(token.change1h)}
                        </p>
                        <p className="text-xs text-gray-400">{token.volume}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Table and Signals */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Market Table */}
          <Card className="xl:col-span-2 bg-terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Icon name="BarChart3" size={20} className="mr-2 text-terminal-green" />
                Таблица рынка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-terminal-border hover:bg-transparent">
                      <TableHead className="text-gray-400">Токен</TableHead>
                      <TableHead className="text-gray-400">Цена</TableHead>
                      <TableHead className="text-gray-400">Объём 24ч</TableHead>
                      <TableHead className="text-gray-400">1ч %</TableHead>
                      <TableHead className="text-gray-400">24ч %</TableHead>
                      <TableHead className="text-gray-400">Спред</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketTokens.map((token) => (
                      <TableRow key={token.symbol} className="border-terminal-border hover:bg-terminal-bg/50 cursor-pointer">
                        <TableCell className="font-semibold text-white">{token.symbol}</TableCell>
                        <TableCell className="font-mono text-white">${formatPrice(token.price)}</TableCell>
                        <TableCell className="text-gray-300">{token.volume}</TableCell>
                        <TableCell className={`font-mono ${token.change1h >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                          {formatChange(token.change1h)}
                        </TableCell>
                        <TableCell className={`font-mono ${token.change24h >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                          {formatChange(token.change24h)}
                        </TableCell>
                        <TableCell className="text-gray-400 font-mono">{token.spread}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Signals */}
          <Card className="bg-terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Icon name="Zap" size={20} className="mr-2 text-terminal-green" />
                Сигналы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {signals.map((signal, index) => (
                  <div key={index} className="p-3 rounded bg-terminal-bg border border-terminal-border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${signal.type === 'pump' ? 'border-terminal-green text-terminal-green' : ''}
                          ${signal.type === 'volume' ? 'border-blue-400 text-blue-400' : ''}
                          ${signal.type === 'drop' ? 'border-terminal-red text-terminal-red' : ''}
                        `}
                      >
                        {signal.type === 'pump' ? 'ПАМП' : signal.type === 'volume' ? 'ОБЪЁМ' : 'ПАДЕНИЕ'}
                      </Badge>
                      <span className="text-xs text-gray-400 font-mono">{signal.time}</span>
                    </div>
                    <p className="font-semibold text-white">{signal.token}</p>
                    <p className="text-sm text-gray-300">{signal.trigger}</p>
                  </div>
                ))}
              </div>
              
              {/* Bot Log Preview */}
              <div className="mt-6 pt-4 border-t border-terminal-border">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Icon name="Bot" size={16} className="mr-2 text-gray-400" />
                  Лог бота
                </h4>
                <div className="text-center py-6 text-gray-400">
                  <Icon name="Wrench" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">В разработке</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border bg-terminal-card mt-12">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>MemeDesk v0.1-alpha</span>
              <span>•</span>
              <span>API: {selectedExchange}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} />
              <span>{new Date().toLocaleTimeString('ru-RU')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;