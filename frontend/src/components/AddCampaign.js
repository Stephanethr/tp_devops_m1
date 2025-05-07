import React, { useState } from 'react';
import axios from 'axios';

function AddCampaign() {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    budget: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/campaigns', formData);
      alert('Campagne ajoutée avec succès!');
      setFormData({
        name: '',
        status: 'active',
        budget: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      console.error('Error adding campaign:', error);
      alert('Erreur lors de l\'ajout de la campagne');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Ajouter une nouvelle campagne</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom de la campagne</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Statut</label>
          <select
            className="form-control"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="paused">Pausée</option>
            <option value="completed">Terminée</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="budget" className="form-label">Budget (€)</label>
          <input
            type="number"
            className="form-control"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Date de début</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">Date de fin</label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>
    </div>
  );
}

export default AddCampaign;