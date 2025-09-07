import React from 'react';

const RouteSelector = ({ routes, selectedRoute, onRouteChange }) => {
  return (
    <div className="route-selector">
      <label htmlFor="route-select">Select Route:</label>
      <select 
        id="route-select"
        value={selectedRoute} 
        onChange={(e) => onRouteChange(e.target.value)}
      >
        <option value="all">All Routes</option>
        {routes.map(route => (
          <option key={route.id} value={route.id}>
            {route.name} ({route.routeNumber})
          </option>
        ))}
      </select>
    </div>
  );
};

export default RouteSelector;