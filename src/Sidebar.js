import React from 'react';
import './sidebar.css';
import Quicklink from './icons/question_exchange_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import GoBack from './icons/arrow_circle_left_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar-section ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className='sidebar'>
        <div className='sidebar-event-section'>
          <div className='sidebar-event-header'>
            Events
            <img src={GoBack} alt='Back' onClick={toggleSidebar} /> {/* Toggle sidebar on click */}
          </div>
          <div className='sidebar-event-categories'>
            <div className='sidebar-event-categories-section'>
              <label>ToDo List</label>
              <li>Do Homework</li>
              <li>Buy Grocery</li>
              <li>Meet Friends</li>
            </div>
            <div className='sidebar-event-section'>
              <label>Reminders</label>
              <li>Business Meeting</li>
              <li>Interview</li>
            </div>
            <div className='sidebar-event-section'>
              <label>Finance</label>
              <li>Lend Money</li>
              <li>Pay Credit Card Bill</li>
            </div>
          </div>
        </div>
        <div className='event-footer-section'>
          <div className='quickLink'>
            <img className='quick-image' src={Quicklink} alt='Quick' />
            Quick Links
          </div>
          <div className='copyright'>
            Copyright &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
