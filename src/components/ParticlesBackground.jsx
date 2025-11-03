// src/components/ParticlesBackground.jsx
import { useEffect } from 'react';

export const ParticlesBackground = () => {
  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector('.particles-container');
      if (!container) return;

      container.innerHTML = '';

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 8 + 2;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 25 + 15;
        const animationDelay = Math.random() * 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        
        container.appendChild(particle);
      }
    };

    createParticles();
    const interval = setInterval(createParticles, 30000); // Recrear cada 30s

    return () => clearInterval(interval);
  }, []);

  return <div className="particles-container" />;
};