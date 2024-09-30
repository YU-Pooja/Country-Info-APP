// src/types.ts
export interface Country {
    name:  string;
    capital: string[];
    region: string;
    timezones: string[];
    population: number;
    flag: string;
    cca2: string;
    code: string;
    languages?: { [key: string]: { name: string } }; // Optional languages field
    currencies?: { [key: string]: { name: string } }; // Optional currencies field
  }
  