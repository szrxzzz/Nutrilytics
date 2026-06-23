import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import axios from 'axios';

const SyncContext = createContext();

import { API_URL } from '../config';

export const SyncProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState([]);
  const [syncStatus, setSyncStatus] = useState('Synced'); // Synced, Syncing, Pending

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadPendingSync();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      performSync();
    }
  }, [isOnline, pendingSync]);

  const loadPendingSync = async () => {
    const queue = await localforage.getItem('syncQueue') || [];
    setPendingSync(queue);
    if (queue.length > 0) setSyncStatus('Pending');
  };

  const addToSyncQueue = async (type, data) => {
    const queue = await localforage.getItem('syncQueue') || [];
    const newItem = { id: Date.now(), type, data, timestamp: new Date().toISOString() };
    const updatedQueue = [...queue, newItem];
    await localforage.setItem('syncQueue', updatedQueue);
    setPendingSync(updatedQueue);
    setSyncStatus('Pending');
  };

  const performSync = async () => {
    setSyncStatus('Syncing');
    const queue = [...pendingSync];
    const payload = {
      children: queue.filter(item => item.type === 'child').map(item => item.data),
      growth: queue.filter(item => item.type === 'growth').map(item => item.data),
      attendance: queue.filter(item => item.type === 'attendance').map(item => item.data),
    };

    try {
      await axios.post(`${API_URL}/sync`, payload);
      await localforage.setItem('syncQueue', []);
      setPendingSync([]);
      setSyncStatus('Synced');
      console.log('Sync successful');
    } catch (error) {
      console.error('Sync failed', error);
      setSyncStatus('Pending');
    }
  };

  return (
    <SyncContext.Provider value={{ isOnline, syncStatus, pendingSync, addToSyncQueue }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => useContext(SyncContext);
