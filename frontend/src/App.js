import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CampaignList from './components/CampaignList';
import AddCampaign from './components/AddCampaign';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Campaign Manager</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Campagnes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add">Ajouter une campagne</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<CampaignList />} />
          <Route path="/add" element={<AddCampaign />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;