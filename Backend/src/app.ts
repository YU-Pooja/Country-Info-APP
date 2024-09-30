import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache';
import cors from 'cors';
import { stringify } from 'querystring';

// Define the Country interface
interface Country {
  name: {
    common: string;
  };
  capital: string[];
  region: string;
  timezones: string[];
  population: number;
  flags: {
    svg: string;
  };
  cca2: string;
  languages?: { [key: string]: { name: string } };
  currencies?: {[key: string]:{[key: string]:[key: string]}}
}

// Extend the Request interface to include the `countriesData` property
interface CustomRequest extends Request {
  countriesData?: Country[];
}

// Initialize express app
const app = express();
app.use(cors());

// Initialize cache with a TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// REST Countries API base URL
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

// Middleware to fetch all countries data once and cache it
const fetchCountriesMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // Check if the data is already cached
    let countriesData = cache.get<Country[]>('countriesData'); // Typed cache data

    // If not cached, fetch the data from the API and cache it
    if (!countriesData) {
      const response: AxiosResponse<Country[]> = await axios.get(`${REST_COUNTRIES_API}/all`);
      countriesData = response.data;
      cache.set('countriesData', countriesData); // Cache the fetched data
      console.log('Fetched and cached countries data');
    } else {
      console.log('Using cached countries data');
    }

    // Attach the data to the req object so it's accessible in the route handlers
    req.countriesData = countriesData;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error fetching countries data:', error);
    res.status(500).json({ message: 'Error fetching countries data' });
  }
};

// Apply the fetchCountriesMiddleware to all routes
app.use(fetchCountriesMiddleware);

// Endpoint to fetch countries with pagination
app.get('/countries', (req: CustomRequest, res: Response): void => {
  try {
    const page = parseInt(req.query._page as string) || 1; // Get the page number, default to 1
    const limit = parseInt(req.query._limit as string) || 10; // Get the limit, default to 10
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const countries = req.countriesData?.slice(startIndex, endIndex).map((country: Country) => ({
      name: country.name.common,
      population: country.population,
      flag: country.flags.svg,
      region: country.region,
      timezones: country.timezones,
      code: country.cca2,
      languages: country.languages,
      currencies: country.currencies,
    }));
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error processing countries data' });
  }
});

// Endpoint to fetch country by code
app.get('/countries/:code', (req: CustomRequest, res: Response): void => {
  try {
    const code = req.params.code.toUpperCase(); // Ensure the code is in uppercase for consistent comparison
    const country = req.countriesData?.find((country: Country) => country.cca2 === code);

      res.json(country);
    
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the country data' });
  }
});

// GET /countries/region/:region - Filter countries by region
app.get('/countries/region/:region', (req: CustomRequest, res: Response): void => {
  try {
    const region = req.params.region;
    const countries = req.countriesData?.filter((country: Country) => country.region === region);

    const FilteredData = countries?.map((country: Country) => ({
      name: country.name.common,
      population: country.population,
      flag: country.flags.svg,
      region: country.region,
      timezones: country.timezones,
      code: country.cca2,
      languages: country.languages,
      currencies: country.currencies,
    }));


    if (FilteredData?.length) {
      res.json(FilteredData);
    } else {
      res.status(404).json({ message: 'No countries found for this region' });
    }


  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the country data' });
  }
});

// Endpoint to search for countries by name, capital, region, or timezone
app.get('/country/search', (req: CustomRequest, res: Response): void => {
  try {
    const { name, capital, region, timezone } = req.query;
    let countries = req.countriesData;

    // Filter by name
    if (name) {
      countries = countries?.filter((country: Country) =>
        country.name.common.toLowerCase().includes((name as string).toLowerCase())
      );
    }

    // Filter by capital
    if (capital) {
      countries = countries?.filter((country: Country) =>
        country.capital && country.capital[0].toLowerCase().includes((capital as string).toLowerCase())
      );
    }

    // Filter by region
    if (region) {
      countries = countries?.filter((country: Country) =>
        country.region && country.region.toLowerCase() === (region as string).toLowerCase()
      );
    }

    // Filter by timezone
    if (timezone) {
      countries = countries?.filter((country: Country) =>
        country.timezones && country.timezones.includes(timezone as string)
      );
    }

    // Return the filtered result
    if (countries?.length) {
      const results = countries?.map((country: Country) => ({
        name: country.name.common,
        population: country.population,
        flag: country.flags.svg,
        region: country.region,
        timezones: country.timezones,
        code: country.cca2,
        languages: country.languages,
        currencies: country.currencies,
      }));
      console.log(JSON.stringify(results));
      res.json(results);
    } else {
      res.status(404).json({ message: 'No countries match the search criteria' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the country data' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
