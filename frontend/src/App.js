import './App.css';
import UrlShortenerForm from './components/UrlShortenerForm';
import UrlResults from './components/UrlResults';
import React, { useState } from 'react';

function App() {
  const [results, setResults] = useState([]);
  return (
    <div className="App">
      <UrlShortenerForm onResults={setResults} />
      <UrlResults results={results} />
    </div>
  );
}

export default App; 