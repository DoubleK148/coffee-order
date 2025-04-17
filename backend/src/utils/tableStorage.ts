import { Table } from '../types/table';
import fs from 'fs';
import path from 'path';

const TABLES_FILE = path.join(__dirname, '../data/tables.json');

export function saveTables(tables: Table[]): void {
  try {
    // Ensure the directory exists
    const dir = path.dirname(TABLES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save tables to file
    fs.writeFileSync(TABLES_FILE, JSON.stringify(tables, null, 2));
  } catch (error) {
    console.error('Error saving tables:', error);
    throw new Error('Failed to save tables');
  }
}

export function loadTables(): Table[] {
  try {
    if (!fs.existsSync(TABLES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(TABLES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading tables:', error);
    return [];
  }
} 