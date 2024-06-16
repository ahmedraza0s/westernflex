import React from 'react';
import Navbar from './components/navbar/Navbar'; // Ensure the path is correct and case-sensitive
import './components/navbar/navbar.css';        // Ensure the path is correct and case-sensitive

const App = () => {
  return (
    <div className="App">
      <Navbar />
      {/* Other components and content */}
    </div>
  );
};

export default App;
