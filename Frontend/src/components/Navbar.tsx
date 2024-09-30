import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCountries } from '../services/apiService';
import CountryCard from './CountryCard';
import { Country } from '../types';
import Filter from './Filter';

interface NavbarProps {
  setSearching: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setSearching }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [neededData, setNeededData] = useState<Country[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State for mobile menu
  const navigate = useNavigate();

  const handleInputbox = async (e: any) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length <= 0) {
      setSearching(true);
      setNeededData([]);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const response = await searchCountries(searchTerm);
      const formattedData: Country[] = response.map((country: any) => ({
        name: country.name,
        capital: country.capital || [],
        region: country.region,
        timezones: country.timezones || [],
        population: country.population,
        flag: country.flag,
        cca2: country.cca2,
        code: country.code,
        languages: country.languages,
        currencies: country.currencies,
      }));

      setNeededData(formattedData);
      setSearching(false);
    }
  };

  return (
    <nav className="bg-blue-900 p-4 pr-7 pt-1 pb-1 relative">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-white font-bold text-5xl">Country Info</h1>
        <div className="hidden md:flex items-center align-baseline">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleInputbox(e)}
            placeholder="Search countries..."
            className="p-2 rounded-l-lg border border-gray-300"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition duration-300"
          >
            Search
          </button>
          <div className='pt-4'>
            <Filter />
          </div>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full bg-white z-10 shadow-lg p-4">
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleInputbox(e)}
              placeholder="Search countries..."
              className="p-2 mb-2 border border-gray-300 rounded-lg w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full mb-4"
            >
              Search
            </button>
            <Filter />
          </div>
          <button
            className="text-blue-600 mt-4"
            onClick={() => setIsMenuOpen(false)} // Close menu button
          >
            Close Menu
          </button>
        </div>
      )}

      <div className='p-2 country-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {searchTerm && neededData.map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
