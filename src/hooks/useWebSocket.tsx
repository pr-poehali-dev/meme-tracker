import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  data: any;
  isConnected: boolean;
  error: string | null;
  send: (data: any) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (config: WebSocketConfig): UseWebSocketReturn => {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  
  const maxReconnectAttempts = config.reconnectAttempts || 5;
  const reconnectInterval = config.reconnectInterval || 3000;

  const connect = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      wsRef.current = new WebSocket(config.url);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        console.log('WebSocket connected to:', config.url);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          setData(event.data);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          setError('Connection failed after maximum reconnect attempts');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      };

    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to create WebSocket connection');
    }
  }, [config.url, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      wsRef.current.send(message);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    data,
    isConnected,
    error,
    send,
    connect,
    disconnect,
  };
};

// Exchange-specific WebSocket hooks
export const useMEXCWebSocket = (symbol: string = 'DOGEUSDT') => {
  const config = {
    url: `wss://wbs.mexc.com/ws`,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  };

  const { data, isConnected, error, send, connect, disconnect } = useWebSocket(config);

  const subscribe = useCallback(() => {
    if (isConnected) {
      // Subscribe to kline data
      send({
        method: 'SUBSCRIPTION',
        params: [`spot@public.kline.v3.api@${symbol}@Min1`],
        id: 1,
      });

      // Subscribe to ticker data
      send({
        method: 'SUBSCRIPTION', 
        params: [`spot@public.bookTicker.v3.api@${symbol}`],
        id: 2,
      });
    }
  }, [isConnected, send, symbol]);

  useEffect(() => {
    if (isConnected) {
      subscribe();
    }
  }, [isConnected, subscribe]);

  return {
    data,
    isConnected,
    error,
    subscribe,
    connect,
    disconnect,
  };
};

export const useBitgetWebSocket = (symbol: string = 'DOGEUSDT') => {
  const config = {
    url: 'wss://ws.bitget.com/v2/ws/public',
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  };

  const { data, isConnected, error, send, connect, disconnect } = useWebSocket(config);

  const subscribe = useCallback(() => {
    if (isConnected) {
      // Subscribe to candlestick data
      send({
        op: 'subscribe',
        args: [{
          instType: 'SPOT',
          channel: 'candle1m',
          instId: symbol,
        }],
      });

      // Subscribe to ticker data
      send({
        op: 'subscribe',
        args: [{
          instType: 'SPOT',
          channel: 'ticker',
          instId: symbol,
        }],
      });
    }
  }, [isConnected, send, symbol]);

  useEffect(() => {
    if (isConnected) {
      subscribe();
    }
  }, [isConnected, subscribe]);

  return {
    data,
    isConnected,
    error,
    subscribe,
    connect,
    disconnect,
  };
};