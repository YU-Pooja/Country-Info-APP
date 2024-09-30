import axios from 'axios';

const BASE_URL = 'https://country-info-app-qodo.onrender.com'; // Backend URL


export interface Country {
  cca2: string;
  name: {
    common: string;
  };
  flags: {
    svg: string;
  };
  region: string;
  population: number;
  languages: { [key: string]: string };
}

// Fetch all countries with pagination
export const fetchCountries = async (page: number): Promise<Country[]> => {
  const response = await axios.get(`${BASE_URL}/countries?page=${page}`);
  return response.data;
};

// Fetch country by code
export const fetchCountryByCode = async (code: string): Promise<Country> => {
  const response = await axios.get(`${BASE_URL}/countries/${code}`);
  debugger;
  return response.data;
};

// Filter countries by region
export const filterCountriesByRegion = async (region: string): Promise<Country[]> => {
  debugger;
  const response = await axios.get(`${BASE_URL}/countries/region/${region}`);
  return response.data;
};

// Search countries by name, capital, region, timezone
export const searchCountries = async (query: string): Promise<Country[]> => {
  debugger;
  const response = await axios.get(`${BASE_URL}/country/search?name=${query}`);
  return response.data;
};
