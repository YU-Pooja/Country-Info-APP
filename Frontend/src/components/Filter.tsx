import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { filterCountriesByRegion } from '../services/apiService';
import { Country } from '../types';
import CountryCard from './CountryCard';

const Filter: React.FC = () => {
  const [regions, setRegions] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const LIMIT = 10;
  const [regionData, setRegionData] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // State for dropdown visibility
  const [selectedRegion, setSelectedRegion] = useState<string>(''); // State for selected region

  useEffect(() => {
    fetchRegions(page);
  }, [page]);

  const fetchRegions = async (page: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(`https://country-info-app-qodo.onrender.com/countries?_page=${page}&_limit=${LIMIT}`);
      const newRegions = response.data.map((country: any) => country.region);
      const uniqueRegions = Array.from(new Set([...regions, ...newRegions]));
      setRegions(uniqueRegions);
      setHasMore(newRegions.length >= LIMIT);
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRegionSelect = async (region: string) => {
    const countryData = await filterCountriesByRegion(region);
    setRegionData(countryData);
    setSelectedRegion(region); // Update the selected region
    setIsDropdownOpen(false); // Close dropdown after selecting a region
  };

  return (
    <div className="p-4 filter-dropdown">
      <div className="relative">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg focus:outline-none flex items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.292 7.293a1 1 0 011.415 0L10 10.585l3.293-3.292a1 1 0 111.415 1.415l-4 4a1 1 0 01-1.415 0l-4-4a1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          {/* Show selected region or default text */}
          {selectedRegion ? `Selected region: ${selectedRegion}` : 'Select a region:'}
        </button>
        
        {/* Dropdown */}
        {isDropdownOpen && (
          <div
            className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg overflow-y-scroll max-h-40"
            onScroll={handleScroll}
          >
            {regions.map((region, index) => (
              <div
                key={index}
                className="dropdown-item px-4 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleRegionSelect(region)}
              >
                {region}
              </div>
            ))}
            {loading && <p className="text-center py-2">Loading more regions...</p>}
            {!hasMore && <p className="text-center py-2">No more regions to load.</p>}
          </div>
        )}
      </div>

      {/* Country Cards */}
      <div className="country-list mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionData.map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </div>
    </div>
  );
};

export default Filter;
