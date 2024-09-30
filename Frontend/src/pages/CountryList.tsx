import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountryCard from '../components/CountryCard';

interface CountryListProps {
  searching: boolean;
}

const CountryList: React.FC<CountryListProps> = ({ searching }) => { 
  const [countries, setCountries] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const LIMIT = 10;

  useEffect(() => {
    console.log('searching state value:', searching);
    
  }, [searching]);

  const fetchCountries = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://country-info-app-qodo.onrender.com/countries?_page=${page}&_limit=${LIMIT}`);
      const newCountries = response.data;
      setCountries((prevCountries) => [...prevCountries, ...newCountries]);

      if (newCountries.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle infinite scroll and other logic...
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight &&
      !loading &&
      hasMore
    ) {
      setPage(prevPage => prevPage + 1);  // Increase the page number when scrolled to bottom
    }
  };

  // Initial fetch and subsequent batch loading when `page` changes
  useEffect(() => {
    fetchCountries(page);
  }, [page]);

  // Attach the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);  // Cleanup listener on component unmount
    };
  }, [loading, hasMore]);

  return (
    <div className="country-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-7">
      {searching && countries.map((country) => (
        <CountryCard key={country.code} country={country} />
      ))}
      {loading && <p>Loading more countries...</p>}
      {!hasMore && <p>No more countries to load.</p>}
    </div>
  );
};

export default CountryList;
