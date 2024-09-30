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
 Clone the Repository

bash
git clone https://github.com/YU-Pooja/Country-Info-APP/country-info-backend.git
cd country-info-backend
npm install //By this all teh dependencies will get cread and node_module willl also added in the project.
npx tsc // use this command to compile and generate the JS file.
Now the Backend is ready to run in local.

# Country Information App - Frontend
This project is the frontend for the **Country Information App**, a React-based web application that displays details of countries with features such as search, filter, infinite scroll, and detailed country pages. The frontend is built using **React**, **TypeScript**, **Tailwind CSS**, and **React Router**.

## Features

- **Country List Page**: Displays a list of countries with their flags, names, and regions.
- **Search Functionality**: Search countries by name, region, or other attributes.
- **Filter by Region**: Filter the list of countries based on region.
- **Lazy Loading & Infinite Scroll**: Automatically loads more countries as the user scrolls down.
- **Responsive Design**: Optimized for mobile and desktop views with a responsive navbar.
- **Country Detail Page**: Shows detailed information about each country, including population, region, languages, currencies, and more.

## Tech Stack

- **Frontend Framework**: React.js
- **State Management**: React Hooks, Context API
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **TypeScript**: For type safety and improved developer experience
- **API Integration**: Fetches country data from the backend

## Installation and Setup

**Clone the repository**:
   git clone https://github.com/YU-Pooja/Country-Info-APP/country-info-frontend.git
   cd country-info-frontend
   npm install
   npm start
Now the frontedn will up and run in local.
