// src/features/contact/components/StatsPanel.jsx
import { useState, useEffect } from 'react';
import { contactApi, getOfflineQueue } from '../api/contactApi';
import '../styles/contact.css';

export const StatsPanel = () => {
  const [metrics, setMetrics] = useState({
    successfulRequests: 0,
    failedRequests: 0,
    averageLatency: 0,
    pendingQueue: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      const apiMetrics = contactApi.getMetrics();
      const queue = getOfflineQueue();
      setMetrics({
        ...apiMetrics,
        pendingQueue: queue.length
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Envíos Exitosos',
      value: metrics.successfulRequests,
      color: 'success'
    },
    {
      label: 'Envíos Fallidos',
      value: metrics.failedRequests,
      color: 'error'
    },
    {
      label: 'Latencia Promedio',
      value: `${metrics.averageLatency}ms`,
      color: 'warning'
    },
    {
      label: 'En Cola Offline',
      value: metrics.pendingQueue,
      color: metrics.pendingQueue > 0 ? 'error' : 'success'
    }
  ];

  return (
    <div className="stats-panel">
      <h3 className="stats-title">Métricas de Contacto</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {(metrics.failedRequests > 0 || metrics.pendingQueue > 0) && (
        <div className="stats-actions">
          <button 
            onClick={() => contactApi.clearMetrics()}
            className="action-button secondary"
          >
            Limpiar Métricas
          </button>
        </div>
      )}
    </div>
  );
};