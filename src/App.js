import React, { useState } from 'react';
import { AuthProvider } from './AuthContext';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Contents from './Contents';
import Contacts from './Contacts';
import Info from './Info'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {

  const [searchQuery, setSearchQuery] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
    <Router>
    <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/info" 
            element={
              <ProtectedRoute>
                <Info />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      
      <div className="App">
        <Header toggleSidebar={toggleSidebar} setSearchQuery={setSearchQuery} /> {/* Pass toggleSidebar to Header */}
        <div className="main-content">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pass sidebar state and toggle function */}
          <div className={`content-area ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Routes>
            <Route path="/" element={<Navigate to="/categories" />} />
              {/* Route to list all categories */}
              <Route path="/categories" element={<Contents />} />
              
              {/* Route to list contacts for a given category */}
              <Route path="/contacts/:categoryId" element={<Contacts searchQuery={searchQuery}/>} />

              {/* Route to show info (To-do, Reminders, Finance) for a specific contact */}
              <Route path="/info/:contentId/:contactId" element={<Info />} />

            
            </Routes>
          </div>
        </div>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
