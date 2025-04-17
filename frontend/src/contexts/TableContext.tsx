import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from '../config/axiosConfig';
import { useAuth } from './AuthContext';
import { Table, TableOrder, TableStatus } from '../types/table';

interface TableContextType {
  tables: Table[];
  loading: boolean;
  error: string | null;
  fetchTables: () => Promise<void>;
  occupyTable: (tableNumber: number, customerInfo: { name: string; email: string; phone?: string }) => Promise<void>;
  freeTable: (tableNumber: number) => Promise<void>;
  reserveTable: (tableNumber: number, customerInfo: { name: string; email: string; phone?: string }) => Promise<void>;
  addOrderToTable: (tableNumber: number, order: Omit<TableOrder, 'orderId' | 'createdAt'>) => Promise<void>;
  getCurrentUserTable: () => Table | undefined;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tables');
      console.log('Raw API response:', response.data);

      let tablesData: Table[] = [];
      
      if (Array.isArray(response.data)) {
        tablesData = response.data;
      } else if (response.data.success && Array.isArray(response.data.data)) {
        tablesData = response.data.data;
      } else if (response.data.tables && Array.isArray(response.data.tables)) {
        tablesData = response.data.tables;
      }

      // Validate and transform the data
      const validTables = tablesData
        .filter(table => 
          typeof table.number === 'number' && 
          table.number > 0 &&
          ['available', 'occupied', 'reserved'].includes(table.status)
        )
        .map(table => ({
          _id: table._id,
          number: table.number,
          status: table.status as TableStatus,
          customerInfo: table.customerInfo,
          currentOrder: table.currentOrder,
          orderHistory: table.orderHistory || []
        }));

      console.log('Setting tables:', validTables);
      setTables(validTables);
      setError(null);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch tables');
      setTables([]); // Reset tables on error
    } finally {
      setLoading(false);
    }
  }, []);

  const occupyTable = useCallback(async (tableNumber: number, customerInfo: { name: string; email: string; phone?: string }) => {
    try {
      await axios.post(`/tables/${tableNumber}/occupy`, { customerInfo });
      await fetchTables();
    } catch (err) {
      console.error('Error occupying table:', err);
      throw err;
    }
  }, [fetchTables]);

  const freeTable = useCallback(async (tableNumber: number) => {
    try {
      await axios.post(`/tables/${tableNumber}/free`);
      await fetchTables();
    } catch (err) {
      console.error('Error freeing table:', err);
      throw err;
    }
  }, [fetchTables]);

  const reserveTable = useCallback(async (tableNumber: number, customerInfo: { name: string; email: string; phone?: string }) => {
    try {
      await axios.post(`/tables/${tableNumber}/reserve`, { customerInfo });
      await fetchTables();
    } catch (err) {
      console.error('Error reserving table:', err);
      throw err;
    }
  }, [fetchTables]);

  const addOrderToTable = useCallback(async (tableNumber: number, order: Omit<TableOrder, 'orderId' | 'createdAt'>) => {
    try {
      await axios.post(`/tables/${tableNumber}/order`, order);
      await fetchTables();
    } catch (err) {
      console.error('Error adding order to table:', err);
      throw err;
    }
  }, [fetchTables]);

  const getCurrentUserTable = useCallback(() => {
    if (!user?.email) return undefined;
    return tables.find(table => 
      table.customerInfo?.email === user.email && 
      (table.status === 'occupied' || table.status === 'reserved')
    );
  }, [tables, user]);

  useEffect(() => {
    if (user) {
      fetchTables();
    }
  }, [user]);

  // Refresh tables every 60 seconds
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      console.log('Refreshing tables...');
      fetchTables();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [user, fetchTables]);

  const value = {
    tables,
    loading,
    error,
    fetchTables,
    occupyTable,
    freeTable,
    reserveTable,
    addOrderToTable,
    getCurrentUserTable,
  };

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

export default TableContext; 