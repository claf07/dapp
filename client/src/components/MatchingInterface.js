import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const MatchingInterface = ({ account, web3 }) => {
  const [map, setMap] = useState(null);
  const [organFilter, setOrganFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [distanceFilter, setDistanceFilter] = useState(50); // km
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-98, 38.88], // USA center
        zoom: 3
      });
      setMap(mapInstance);
    };
    if (!map) initializeMap();
  }, [map]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'organ') setOrganFilter(value);
    else if (name === 'urgency') setUrgencyFilter(value);
    else if (name === 'distance') setDistanceFilter(Number(value));
  };

  const handleMatch = () => {
    // TODO: Call contract or off-chain service to get matches based on filters
    alert('Match functionality to be implemented');
  };

  return (
    <div>
      <h2>Matching Interface</h2>
      <div>
        <label>
          Organ:
          <input type="text" name="organ" value={organFilter} onChange={handleFilterChange} />
        </label>
        <label>
          Urgency:
          <select name="urgency" value={urgencyFilter} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </label>
        <label>
          Distance (km):
          <input type="number" name="distance" value={distanceFilter} onChange={handleFilterChange} min="1" max="500" />
        </label>
        <button onClick={handleMatch}>Find Matches</button>
      </div>
      <div id="map" style={{ width: '100%', height: '400px', marginTop: '10px' }}></div>
      <div>
        <h3>Matches</h3>
        {matches.length === 0 ? (
          <p>No matches found.</p>
        ) : (
          <ul>
            {matches.map((match, index) => (
              <li key={index}>{match}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MatchingInterface;
