import { Types } from 'mongoose';
import { Table, CustomerInfo, TableOrder } from '../types/table';
import { saveTables, loadTables } from '../utils/tableStorage';

export class TableManager {
  private tables: Table[];

  constructor() {
    this.tables = loadTables() || this.initializeTables();
  }

  private initializeTables(): Table[] {
    // Initialize with some default tables
    const defaultTables: Table[] = Array.from({ length: 10 }, (_, i) => ({
      _id: new Types.ObjectId(),
      number: i + 1,
      capacity: 4,
      status: 'available',
      location: i < 6 ? 'indoor' : 'outdoor',
      currentOrder: null,
      orderHistory: []
    }));
    saveTables(defaultTables);
    return defaultTables;
  }

  public getTables(): Table[] {
    return this.tables;
  }

  public getTableByNumber(number: number): Table | undefined {
    return this.tables.find(table => table.number === number);
  }

  public updateTable(updatedTable: Table): Table {
    const index = this.tables.findIndex(t => t._id.equals(updatedTable._id));
    if (index === -1) {
      throw new Error(`Table with ID ${updatedTable._id} not found`);
    }
    this.tables[index] = updatedTable;
    saveTables(this.tables);
    return updatedTable;
  }

  public occupyTable(tableNumber: number, customerInfo: CustomerInfo): Table {
    const table = this.getTableByNumber(tableNumber);
    if (!table) {
      throw new Error(`Table ${tableNumber} not found`);
    }
    if (table.status !== 'available') {
      throw new Error(`Table ${tableNumber} is not available`);
    }

    table.status = 'occupied';
    table.customerInfo = customerInfo;
    table.currentOrder = null;
    
    this.updateTable(table);
    return table;
  }

  public freeTable(tableNumber: number): Table {
    const table = this.getTableByNumber(tableNumber);
    if (!table) {
      throw new Error(`Table ${tableNumber} not found`);
    }
    if (table.status !== 'occupied') {
      throw new Error(`Table ${tableNumber} is not occupied`);
    }

    if (table.currentOrder) {
      table.orderHistory.push(table.currentOrder);
    }

    table.status = 'available';
    table.customerInfo = undefined;
    table.currentOrder = null;
    
    this.updateTable(table);
    return table;
  }

  public addOrder(tableNumber: number, order: TableOrder): Table {
    const table = this.getTableByNumber(tableNumber);
    if (!table) {
      throw new Error(`Table ${tableNumber} not found`);
    }
    if (table.status !== 'occupied') {
      throw new Error(`Table ${tableNumber} is not occupied`);
    }

    table.currentOrder = order;
    this.updateTable(table);
    return table;
  }
} 