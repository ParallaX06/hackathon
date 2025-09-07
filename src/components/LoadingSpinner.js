import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading fade-in">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;