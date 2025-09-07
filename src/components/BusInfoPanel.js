import React from 'react';

const BusInfoPanel = ({ children }) => {
  return (
    <div className="bus-info-panel slide-in">
      <h3>🚌 Live Bus Tracking</h3>
      {children}
    </div>
  );
};

export default BusInfoPanel;