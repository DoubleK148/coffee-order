import { Types } from 'mongoose';
import { Table as TableType, CustomerInfo, TableOrder } from '../types/table';

// Danh sách bàn mặc định
export const defaultTables: TableType[] = [
  {
    _id: new Types.ObjectId(),
    number: 1,
    capacity: 2,
    status: 'available',
    location: 'indoor',
    currentOrder: null,
    orderHistory: []
  },
  {
    _id: new Types.ObjectId(),
    number: 2,
    capacity: 4,
    status: 'available',
    location: 'indoor',
    currentOrder: null,
    orderHistory: []
  },
  {
    _id: new Types.ObjectId(),
    number: 3,
    capacity: 6,
    status: 'available',
    location: 'indoor',
    currentOrder: null,
    orderHistory: []
  },
  {
    _id: new Types.ObjectId(),
    number: 4,
    capacity: 4,
    status: 'available',
    location: 'outdoor',
    currentOrder: null,
    orderHistory: []
  },
  {
    _id: new Types.ObjectId(),
    number: 5,
    capacity: 8,
    status: 'available',
    location: 'indoor',
    currentOrder: null,
    orderHistory: []
  },
  {
    _id: new Types.ObjectId(),
    number: 6,
    capacity: 2,
    status: 'available',
    location: 'outdoor',
    currentOrder: null,
    orderHistory: []
  }
];

// Singleton để quản lý trạng thái bàn trong memory
class TableManager {
  private static instance: TableManager;
  private tables: TableType[];

  private constructor() {
    this.tables = [...defaultTables];
  }

  public static getInstance(): TableManager {
    if (!TableManager.instance) {
      TableManager.instance = new TableManager();
    }
    return TableManager.instance;
  }

  public getTables(): TableType[] {
    return this.tables;
  }

  public getTableById(id: string): TableType | undefined {
    return this.tables.find(table => table._id.toString() === id);
  }

  public getTableByNumber(number: number): TableType | undefined {
    return this.tables.find(table => table.number === number);
  }

  public updateTableStatus(
    tableNumber: number, 
    status: TableType['status'], 
    customerInfo?: CustomerInfo
  ): TableType | undefined {
    const tableIndex = this.tables.findIndex(table => table.number === tableNumber);
    if (tableIndex === -1) return undefined;

    this.tables[tableIndex] = {
      ...this.tables[tableIndex],
      status,
      customerInfo: status === 'available' ? undefined : customerInfo
    };

    return this.tables[tableIndex];
  }

  public updateTableOrder(
    tableNumber: number,
    order: TableOrder
  ): TableType | undefined {
    const tableIndex = this.tables.findIndex(table => table.number === tableNumber);
    if (tableIndex === -1) return undefined;

    const table = this.tables[tableIndex];
    if (table.status !== 'occupied') return undefined;

    // Move current order to history if exists
    if (table.currentOrder) {
      table.orderHistory = [...table.orderHistory, table.currentOrder];
    }

    // Set new order as current
    table.currentOrder = order;

    return table;
  }

  public resetTables(): void {
    this.tables = [...defaultTables];
  }

  public getAvailableTables(): TableType[] {
    return this.tables.filter(table => table.status === 'available');
  }

  public getTablesByLocation(location: TableType['location']): TableType[] {
    return this.tables.filter(table => table.location === location);
  }

  public getTablesByCapacity(minCapacity: number): TableType[] {
    return this.tables.filter(table => table.capacity >= minCapacity);
  }
}

export const tableManager = TableManager.getInstance(); 