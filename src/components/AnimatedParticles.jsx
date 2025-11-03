// src/components/AnimatedParticles.jsx
import { useEffect } from 'react';

export const AnimatedParticles = () => {
  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector('.login-particles');
      if (!container) return;

      container.innerHTML = '';

      const particleCount = 12;
      const shapes = ['circle', 'square', 'triangle'];
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'login-particle';
        
        const size = Math.random() * 8 + 3;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 8;
        const animationDelay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.3;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        particle.style.opacity = opacity;
        
        // Colores aleatorios dentro de la paleta azul-verde
        const hue = Math.random() * 60 + 190; // Entre 190-250 (azules)
        const saturation = Math.random() * 30 + 70; // 70-100%
        const lightness = Math.random() * 20 + 60; // 60-80%
        particle.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Diferentes formas
        if (shape === 'square') {
          particle.style.borderRadius = '4px';
        } else if (shape === 'triangle') {
          particle.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
          particle.style.background = 'transparent';
          particle.style.borderBottom = `${size}px solid hsl(${hue}, ${saturation}%, ${lightness}%)`;
          particle.style.borderLeft = `${size/2}px solid transparent`;
          particle.style.borderRight = `${size/2}px solid transparent`;
          particle.style.width = '0';
          particle.style.height = '0';
        }
        
        container.appendChild(particle);
      }
    };

    createParticles();
    const interval = setInterval(createParticles, 15000);

    return () => clearInterval(interval);
  }, []);

  return <div className="login-particles" />;
};