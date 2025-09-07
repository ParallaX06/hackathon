import React, { useState } from 'react';
import { startBusSimulation, stopBusSimulation, getSimulationStatus } from '../utils/busSimulator';
import { toast } from 'react-toastify';

const SimulationControl = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [status, setStatus] = useState(getSimulationStatus());

  const handleStartSimulation = async () => {
    try {
      await startBusSimulation();
      setIsSimulating(true);
      setStatus(getSimulationStatus());
      toast.success('Bus simulation started! You should see demo buses moving on the map.');
    } catch (error) {
      console.error('Error starting simulation:', error);
      toast.error('Failed to start simulation');
    }
  };

  const handleStopSimulation = () => {
    try {
      stopBusSimulation();
      setIsSimulating(false);
      setStatus(getSimulationStatus());
      toast.info('Bus simulation stopped');
    } catch (error) {
      console.error('Error stopping simulation:', error);
      toast.error('Failed to stop simulation');
    }
  };

  return (
    <div className="simulation-control">
      <h4>
        🎯 Demo Mode
      </h4>
      
      <div className="status-info">
        <p><strong>Status:</strong> {status.running ? '✅ Running' : '⭕ Stopped'}</p>
        <p><strong>Demo Buses:</strong> {status.busCount}</p>
      </div>

      <button
        className={`demo-button ${status.running ? 'stop' : 'start'}`}
        onClick={status.running ? handleStopSimulation : handleStartSimulation}
      >
        {status.running ? '⏹️ Stop Demo' : '▶️ Start Demo'}
      </button>

      <p className="demo-description">
        Demo mode creates virtual buses for testing. Perfect for hackathon demonstrations!
      </p>
    </div>
  );
};

export default SimulationControl;