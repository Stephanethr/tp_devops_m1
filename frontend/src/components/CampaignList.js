import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/campaigns');
        setCampaigns(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Gestion des Campagnes Publicitaires</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Statut</th>
            <th>Budget</th>
            <th>Date de début</th>
            <th>Date de fin</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length > 0 ? (
            campaigns.map(campaign => (
              <tr key={campaign._id}>
                <td>{campaign.name}</td>
                <td>{campaign.status}</td>
                <td>{campaign.budget} €</td>
                <td>{new Date(campaign.startDate).toLocaleDateString()}</td>
                <td>{new Date(campaign.endDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Aucune campagne trouvée</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignList;