interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  location: 'indoor' | 'outdoor';
}

// Danh sách bàn mặc định
export const defaultTables: Table[] = [
  {
    id: 'T001',
    name: 'Bàn 1',
    capacity: 2,
    status: 'available',
    location: 'indoor'
  },
  {
    id: 'T002',
    name: 'Bàn 2',
    capacity: 4,
    status: 'available',
    location: 'indoor'
  },
  {
    id: 'T003',
    name: 'Bàn 3',
    capacity: 6,
    status: 'available',
    location: 'indoor'
  },
  {
    id: 'T004',
    name: 'Bàn 4',
    capacity: 4,
    status: 'available',
    location: 'outdoor'
  },
  {
    id: 'T005',
    name: 'Bàn 5',
    capacity: 8,
    status: 'available',
    location: 'indoor'
  },
  {
    id: 'T006',
    name: 'Bàn 6',
    capacity: 2,
    status: 'available',
    location: 'outdoor'
  }
]

// Singleton để quản lý trạng thái bàn trong memory
class TableManager {
  private static instance: TableManager;
  private tables: Table[];

  private constructor() {
    this.tables = [...defaultTables];
  }

  public static getInstance(): TableManager {
    if (!TableManager.instance) {
      TableManager.instance = new TableManager();
    }
    return TableManager.instance;
  }

  public getTables(): Table[] {
    return this.tables;
  }

  public getTableById(id: string): Table | undefined {
    return this.tables.find(table => table.id === id);
  }

  public updateTableStatus(id: string, status: Table['status']): Table | undefined {
    const tableIndex = this.tables.findIndex(table => table.id === id);
    if (tableIndex === -1) return undefined;

    this.tables[tableIndex] = {
      ...this.tables[tableIndex],
      status
    };

    return this.tables[tableIndex];
  }

  public resetTables(): void {
    this.tables = [...defaultTables];
  }

  public getAvailableTables(): Table[] {
    return this.tables.filter(table => table.status === 'available');
  }

  public getTablesByLocation(location: Table['location']): Table[] {
    return this.tables.filter(table => table.location === location);
  }

  public getTablesByCapacity(minCapacity: number): Table[] {
    return this.tables.filter(table => table.capacity >= minCapacity);
  }
}

export const tableManager = TableManager.getInstance(); 