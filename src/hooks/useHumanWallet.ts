import { useState, useEffect } from 'react';

// Mock implementation of Human Wallet
export function useHumanWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<{ value: string; formatted: string } | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);

  const connect = async () => {
    // Mock connection
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 42);
    setAddress(mockAddress);
    setIsConnected(true);
    setBalance({
      value: '1250000000000000000000', // 1250 G$
      formatted: '1,250.00'
    });
    setEnsName(null);
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(null);
    setEnsName(null);
  };

  return {
    address,
    isConnected,
    balance,
    ensName,
    connect,
    disconnect,
  };
}
