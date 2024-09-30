# Country-Info-APP
This Project build using the React Js + Typescript +Node JS(Express JS). Implemented Paging, batch loading, mapping, Interfaces, API calls, Scrolling, Lazy loading, Caching,  Data Processing, Routing , Searching, filtering, Security. 

# Country Information App - Backend
This is the backend service for the Country Information App, built using **Node.js**, **Express.js**, and **TypeScript**. It provides RESTful APIs to fetch and manage country data, including searching, filtering, and retrieving detailed country information.

## Features
- Fetch a list of countries with pagination
- Search countries by name, capital, region, and timezone
- Filter countries by region
- Get detailed information about a specific country by code

## Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **Axios**

## API Endpoints

- **Base URL:** /api
GET /countries?page=:page

**Fetch a paginated list of countries.**
GET /countries/:code

**Get detailed information about a country by its code.**
GET /countries/region/:region

**Get a list of countries filtered by region.**
GET /country/search?name=:query

**Search for countries by name, capital, region, or timezone.**

## Prerequisites
Ensure that you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/))

## Setup Instructions
### Clone the Repository

```bash
git clone https://github.com/yourusername/country-info-backend.git
cd country-info-backend
npm install //By this all teh dependencies will get cread and node_module willl also added in the project.
npx tsc // use this command to compile and generate the JS file.
Now the BAckend is ready to run in local.

