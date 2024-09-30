import React, { useEffect, useState } from 'react';
import { fetchCountryByCode, Country } from '../services/apiService';
import { useParams, useNavigate } from 'react-router-dom';

const CountryDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    debugger;
    const fetchCountry = async () => {
      if (code) {
        const countryData = await fetchCountryByCode(code);
        debugger;
        setCountry(countryData);
      }
    };

    fetchCountry();
  }, [code]);

  if (!country) {
    return <div className="text-center text-2xl py-10">Loading...</div>;
  }

  return (
    <div className=" bg-white bg-gradient-to-r flex p-10 justify-center">
      <div className=" bg-gradient-to-r from-blue-900 to-blue-500 shadow-lg rounded-lg overflow-hidden flex w-full max-w-3xl items-center">
        <div className="w-1/2 flex justify-center items-center">
          <img
            src={country.flags.svg}
            alt={country.name.common}
            className=" w-100 h-60 bg-cover object-cover shadow-lg p-5"
          />
        </div>

        <div className="text-white w-1/2 p-6 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{country.name.common}</h1>
          <p className="text-lg mb-2">
            <span className="font-semibold">Population:</span> {country.population.toLocaleString()}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Region:</span> {country.region}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Languages:</span> {Object.values(country.languages).join(', ')}
          </p>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)} // Navigate back to the previous page
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
