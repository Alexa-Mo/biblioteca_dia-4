// src/features/contact/api/contactApi.js
import axios from 'axios';

const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' });

// Simular delay y errores
const simulateRequest = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  // 20% de probabilidad de error
  if (Math.random() < 0.2) {
    throw new Error('Temporary failure - Please try again');
  }
  return { status: 'success', id: Date.now() };
};

// Métricas globales
const metrics = {
  successfulRequests: 0,
  failedRequests: 0,
  totalLatency: 0,
  requestCount: 0
};

export const contactApi = {
  sendContact: async (payload, idempotencyKey) => {
    const maxRetries = 2;
    let attempt = 0;
    const headers = { 
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json'
    };

    const t0 = performance.now();

    while (attempt <= maxRetries) {
      try {
        // Simular llamada a API real
        const response = await simulateRequest();
        
        const t1 = performance.now();
        const latency = t1 - t0;
        
        // Actualizar métricas
        metrics.successfulRequests++;
        metrics.totalLatency += latency;
        metrics.requestCount++;
        
        // Guardar en localStorage para persistencia
        const successData = {
          type: 'SUCCESS',
          payload,
          idempotencyKey,
          latency,
          timestamp: new Date().toISOString()
        };
        trackMetric(successData);
        
        return { ...response, latency };
      } catch (error) {
        attempt++;
        
        // Actualizar métricas de error
        metrics.failedRequests++;
        metrics.requestCount++;
        
        const errorData = {
          type: 'ERROR',
          payload,
          idempotencyKey,
          error: error.message,
          attempt,
          timestamp: new Date().toISOString()
        };
        trackMetric(errorData);

        if (attempt > maxRetries) {
          // Guardar en cola offline si falla después de todos los reintentos
          if (!navigator.onLine) {
            addToOfflineQueue(payload, idempotencyKey);
          }
          throw error;
        }
        
        // Backoff lineal
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  },

  getMetrics: () => {
    const avgLatency = metrics.requestCount > 0 ? metrics.totalLatency / metrics.requestCount : 0;
    return {
      successfulRequests: metrics.successfulRequests,
      failedRequests: metrics.failedRequests,
      averageLatency: Math.round(avgLatency),
      pendingQueue: getOfflineQueue().length
    };
  },

  clearMetrics: () => {
    metrics.successfulRequests = 0;
    metrics.failedRequests = 0;
    metrics.totalLatency = 0;
    metrics.requestCount = 0;
    localStorage.removeItem('contact_metrics');
  }
};

// Funciones de utilidad para manejo offline
const OFFLINE_QUEUE_KEY = 'contact_offline_queue';
const METRICS_KEY = 'contact_metrics';

const trackMetric = (data) => {
  const existing = JSON.parse(localStorage.getItem(METRICS_KEY) || '[]');
  existing.push(data);
  localStorage.setItem(METRICS_KEY, JSON.stringify(existing.slice(-100))); // Mantener solo últimos 100
};

const addToOfflineQueue = (payload, idempotencyKey) => {
  const queue = getOfflineQueue();
  queue.push({
    payload,
    idempotencyKey,
    createdAt: new Date().toISOString(),
    attempts: 0
  });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

export const getOfflineQueue = () => {
  return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
};

export const syncOfflineQueue = async () => {
  const queue = getOfflineQueue();
  const successful = [];
  
  for (const item of queue) {
    try {
      await contactApi.sendContact(item.payload, item.idempotencyKey);
      successful.push(item.idempotencyKey);
    } catch (error) {
      console.warn('Failed to sync queued message:', error);
    }
  }
  
  // Remover los exitosos de la cola
  const updatedQueue = queue.filter(item => !successful.includes(item.idempotencyKey));
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
  
  return successful.length;
};

// Sincronizar automáticamente cuando vuelve la conexión
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncOfflineQueue();
  });
}