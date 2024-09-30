import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CountryList from './pages/CountryList';
import CountryDetail from './pages/CountryDetail';
import Navbar from './components/Navbar'; // Import the Navbar
import Filter from './components/Filter';
import './index.css';

const App: React.FC = () => {
  const [searching, setSearching] = useState<boolean>(true);

  return (
    <Router>
      <Navbar setSearching={setSearching} />
      <Routes>
        <Route path="/" element={<CountryList searching={searching} />} /> 
        <Route path="/countries/:code" element={<CountryDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
