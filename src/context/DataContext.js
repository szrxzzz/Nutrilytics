import React, { createContext, useState, useContext, useEffect } from 'react';
import localforage from 'localforage';
import { generateSampleData } from '../data/sampleData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children: childrenProp }) => {
  const [children, setChildren] = useState([]);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [syncStatus, setSyncStatus] = useState('online');
  const [pendingSync, setPendingSync] = useState([]);

  useEffect(() => {
    loadData();
    checkOnlineStatus();
    window.addEventListener('online', () => setSyncStatus('online'));
    window.addEventListener('offline', () => setSyncStatus('offline'));
  }, []);

  const loadData = async () => {
    try {
      let storedChildren = await localforage.getItem('children');
      if (!storedChildren || storedChildren.length === 0) {
        const sampleData = generateSampleData();
        storedChildren = sampleData.children;
        await localforage.setItem('children', storedChildren);
        await localforage.setItem('growthRecords', sampleData.growthRecords);
        await localforage.setItem('attendanceRecords', sampleData.attendanceRecords);
        await localforage.setItem('vaccinationRecords', sampleData.vaccinationRecords);
        await localforage.setItem('alerts', sampleData.alerts);
        setGrowthRecords(sampleData.growthRecords);
        setAttendanceRecords(sampleData.attendanceRecords);
        setVaccinationRecords(sampleData.vaccinationRecords);
        setAlerts(sampleData.alerts);
      } else {
        setGrowthRecords(await localforage.getItem('growthRecords') || []);
        setAttendanceRecords(await localforage.getItem('attendanceRecords') || []);
        setVaccinationRecords(await localforage.getItem('vaccinationRecords') || []);
        setAlerts(await localforage.getItem('alerts') || []);
      }
      setChildren(storedChildren);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const checkOnlineStatus = () => {
    setSyncStatus(navigator.onLine ? 'online' : 'offline');
  };

  const addChild = async (childData) => {
    const newChild = {
      id: Date.now().toString(),
      ...childData,
      createdAt: new Date().toISOString()
    };
    const updated = [...children, newChild];
    setChildren(updated);
    await localforage.setItem('children', updated);
    queueForSync('child', newChild);
    return newChild;
  };

  const addGrowthRecord = async (record) => {
    const newRecord = {
      id: Date.now().toString(),
      ...record,
      recordedAt: new Date().toISOString()
    };
    const updated = [...growthRecords, newRecord];
    setGrowthRecords(updated);
    await localforage.setItem('growthRecords', updated);
    queueForSync('growth', newRecord);
    return newRecord;
  };

  const queueForSync = (type, data) => {
    if (syncStatus === 'offline') {
      setPendingSync([...pendingSync, { type, data, timestamp: Date.now() }]);
    }
  };

  const value = {
    children,
    growthRecords,
    attendanceRecords,
    vaccinationRecords,
    alerts,
    notifications,
    syncStatus,
    pendingSync,
    addChild,
    addGrowthRecord,
    setChildren,
    setGrowthRecords,
    setAttendanceRecords,
    setVaccinationRecords,
    setAlerts,
    setNotifications
  };

  return <DataContext.Provider value={value}>{childrenProp}</DataContext.Provider>;
};
