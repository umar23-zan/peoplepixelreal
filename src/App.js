import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Contents from './Contents';
import Contacts from './Contacts';
import Friends from './Friends';
import Others from './Others';
import Addmore from './Addmore';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App">
        <Header toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to Header */}
        <div className="main-content">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pass sidebar state and toggle function */}
          <div className={`content-area ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Routes>
              <Route path="/" element={<Contents />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/others" element={<Others />} />
              <Route path="/addmore" element={<Addmore />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
