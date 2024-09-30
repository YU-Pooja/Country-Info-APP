// src/components/CountryCard.tsx
import React, { useEffect, useState } from 'react';
import { Country } from '../types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  debugger;
  const [currentTime, setCurrentTime] = useState<string>('Loading...');
  const [utcTime, setUtcTime] = useState<string | null>(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch current UTC time once when the component mounts
  useEffect(() => {
    const fetchUtcTime = async () => {
      try {
        const response = await fetch(`http://worldtimeapi.org/api/timezone/Etc/UTC`);
        const data = await response.json();
        setUtcTime(data.datetime);
      } catch (error) {
        console.error('Error fetching UTC time:', error);
      }
    };

    fetchUtcTime();
  }, []);

  useEffect(() => {
    if (utcTime && country.timezones && country.timezones.length > 0) {
      const timezone = country.timezones[0];
      const timezoneOffset = parseTimezoneOffset(timezone);

      const localTime = calculateLocalTime(utcTime, timezoneOffset);
      setCurrentTime(localTime);
    } else {
      setCurrentTime('N/A');
    }
  }, [utcTime, country]);

  // Function to parse timezone offset from string
  const parseTimezoneOffset = (timezone: string): number => {
    const match = timezone.match(/UTC([+-]\d{1,2}):?(\d{2})?/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      return hours * 60 + minutes; // Return total offset in minutes
    }
    return 0; // Default to 0 if parsing fails
  };

  // Function to calculate local time based on UTC time and timezone offset
  const calculateLocalTime = (utcTime: string, timezoneOffset: number): string => {
    const utcDate = new Date(utcTime);
    utcDate.setMinutes(utcDate.getMinutes() + timezoneOffset); // Adjust for timezone offset

    return utcDate.toLocaleString("en-US", {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A'; // Changed to get first 2 languages
  const currencies = country.currencies ? Object.values(country.currencies).map((curr: any) => curr.name).join(', ') : 'N/A';

  // Function to handle image click and navigate to country detail
  const handleFlagClick = () => {
    debugger;
    navigate(`/countries/${country.code}`);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center p-4">
      <div className="border rounded-lg p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-80 w-64">
        <img
          src={country.flag}
          alt={`${country.name} flag`}
          className="h-24 w-24 mb-4 cursor-pointer shadow-md transition-transform transform hover:scale-105" // Added hover effect
          onClick={handleFlagClick} // Added onClick event to navigate
        />
        <h2 className="font-bold text-xl text-gray-800">{country.name}</h2>
        <p className="text-sm text-gray-600">Population: {country.population.toLocaleString()}</p>
        <p className="text-sm text-gray-600">Region: {country.region}</p>
        <p className="text-sm text-gray-600">Current Time: {currentTime}</p>
        <p className="text-sm text-gray-600">Languages: {languages}</p>
        <p className="text-sm text-gray-600">Currencies: {currencies}</p>
      </div>
    </div>
  );
};

export default CountryCard;
