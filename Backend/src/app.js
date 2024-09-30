"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const node_cache_1 = __importDefault(require("node-cache"));
const cors_1 = __importDefault(require("cors"));
// Initialize express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Initialize cache with a TTL of 1 hour
const cache = new node_cache_1.default({ stdTTL: 3600 });
// REST Countries API base URL
const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';
// Middleware to fetch all countries data once and cache it
const fetchCountriesMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the data is already cached
        let countriesData = cache.get('countriesData'); // Typed cache data
        // If not cached, fetch the data from the API and cache it
        if (!countriesData) {
            const response = yield axios_1.default.get(`${REST_COUNTRIES_API}/all`);
            countriesData = response.data;
            cache.set('countriesData', countriesData); // Cache the fetched data
            console.log('Fetched and cached countries data');
        }
        else {
            console.log('Using cached countries data');
        }
        // Attach the data to the req object so it's accessible in the route handlers
        req.countriesData = countriesData;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error('Error fetching countries data:', error);
        res.status(500).json({ message: 'Error fetching countries data' });
    }
});
// Apply the fetchCountriesMiddleware to all routes
app.use(fetchCountriesMiddleware);
// Endpoint to fetch countries with pagination
app.get('/countries', (req, res) => {
    var _a;
    try {
        const page = parseInt(req.query._page) || 1; // Get the page number, default to 1
        const limit = parseInt(req.query._limit) || 10; // Get the limit, default to 10
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const countries = (_a = req.countriesData) === null || _a === void 0 ? void 0 : _a.slice(startIndex, endIndex).map((country) => ({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing countries data' });
    }
});
// Endpoint to fetch country by code
app.get('/countries/:code', (req, res) => {
    var _a;
    try {
        const code = req.params.code.toUpperCase(); // Ensure the code is in uppercase for consistent comparison
        const country = (_a = req.countriesData) === null || _a === void 0 ? void 0 : _a.find((country) => country.cca2 === code);
        res.json(country);
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the country data' });
    }
});
// GET /countries/region/:region - Filter countries by region
app.get('/countries/region/:region', (req, res) => {
    var _a;
    try {
        const region = req.params.region;
        const countries = (_a = req.countriesData) === null || _a === void 0 ? void 0 : _a.filter((country) => country.region === region);
        const FilteredData = countries === null || countries === void 0 ? void 0 : countries.map((country) => ({
            name: country.name.common,
            population: country.population,
            flag: country.flags.svg,
            region: country.region,
            timezones: country.timezones,
            code: country.cca2,
            languages: country.languages,
            currencies: country.currencies,
        }));
        if (FilteredData === null || FilteredData === void 0 ? void 0 : FilteredData.length) {
            res.json(FilteredData);
        }
        else {
            res.status(404).json({ message: 'No countries found for this region' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the country data' });
    }
});
// Endpoint to search for countries by name, capital, region, or timezone
app.get('/country/search', (req, res) => {
    try {
        const { name, capital, region, timezone } = req.query;
        let countries = req.countriesData;
        // Filter by name
        if (name) {
            countries = countries === null || countries === void 0 ? void 0 : countries.filter((country) => country.name.common.toLowerCase().includes(name.toLowerCase()));
        }
        // Filter by capital
        if (capital) {
            countries = countries === null || countries === void 0 ? void 0 : countries.filter((country) => country.capital && country.capital[0].toLowerCase().includes(capital.toLowerCase()));
        }
        // Filter by region
        if (region) {
            countries = countries === null || countries === void 0 ? void 0 : countries.filter((country) => country.region && country.region.toLowerCase() === region.toLowerCase());
        }
        // Filter by timezone
        if (timezone) {
            countries = countries === null || countries === void 0 ? void 0 : countries.filter((country) => country.timezones && country.timezones.includes(timezone));
        }
        // Return the filtered result
        if (countries === null || countries === void 0 ? void 0 : countries.length) {
            const results = countries === null || countries === void 0 ? void 0 : countries.map((country) => ({
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
        }
        else {
            res.status(404).json({ message: 'No countries match the search criteria' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the country data' });
    }
});
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map