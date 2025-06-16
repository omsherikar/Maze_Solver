import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    // Particle system
    const particles: Particle[] = [];
    const numParticles = 40;

    // Create initial particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const drawGrid = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(17, 24, 39, 0.95)');
      gradient.addColorStop(1, 'rgba(17, 24, 39, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate perspective based on mouse position
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const perspectiveX = (mouseX - centerX) / centerX;
      const perspectiveY = (mouseY - centerY) / centerY;

      // Draw main grid
      const gridSize = 40;

      // Draw vertical lines with perspective and gradient
      for (let x = 0; x <= canvas.width; x += gridSize) {
        const perspectiveOffset = (x - centerX) * perspectiveX * 0.15;
        const distanceFromCenter = Math.abs(x - centerX) / centerX;
        const opacity = 0.2 * (1 - distanceFromCenter * 0.5);
        
        const gradient = ctx.createLinearGradient(x + perspectiveOffset, 0, x + perspectiveOffset, canvas.height);
        gradient.addColorStop(0, `rgba(100, 149, 237, ${opacity * 0.5})`);
        gradient.addColorStop(0.5, `rgba(100, 149, 237, ${opacity})`);
        gradient.addColorStop(1, `rgba(100, 149, 237, ${opacity * 0.5})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.moveTo(x + perspectiveOffset, 0);
        ctx.lineTo(x + perspectiveOffset, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines with perspective and gradient
      for (let y = 0; y <= canvas.height; y += gridSize) {
        const perspectiveOffset = (y - centerY) * perspectiveY * 0.15;
        const distanceFromCenter = Math.abs(y - centerY) / centerY;
        const opacity = 0.2 * (1 - distanceFromCenter * 0.5);
        
        const gradient = ctx.createLinearGradient(0, y + perspectiveOffset, canvas.width, y + perspectiveOffset);
        gradient.addColorStop(0, `rgba(100, 149, 237, ${opacity * 0.5})`);
        gradient.addColorStop(0.5, `rgba(100, 149, 237, ${opacity})`);
        gradient.addColorStop(1, `rgba(100, 149, 237, ${opacity * 0.5})`);
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.moveTo(0, y + perspectiveOffset);
        ctx.lineTo(canvas.width, y + perspectiveOffset);
        ctx.stroke();
      }

      // Draw secondary grid (smaller)
      const secondaryGridSize = gridSize / 2;
      ctx.strokeStyle = 'rgba(100, 149, 237, 0.05)';
      ctx.lineWidth = 0.5;

      // Draw secondary vertical lines
      for (let x = secondaryGridSize; x <= canvas.width; x += secondaryGridSize) {
        const perspectiveOffset = (x - centerX) * perspectiveX * 0.1;
        ctx.beginPath();
        ctx.moveTo(x + perspectiveOffset, 0);
        ctx.lineTo(x + perspectiveOffset, canvas.height);
        ctx.stroke();
      }

      // Draw secondary horizontal lines
      for (let y = secondaryGridSize; y <= canvas.height; y += secondaryGridSize) {
        const perspectiveOffset = (y - centerY) * perspectiveY * 0.1;
        ctx.beginPath();
        ctx.moveTo(0, y + perspectiveOffset);
        ctx.lineTo(canvas.width, y + perspectiveOffset);
        ctx.stroke();
      }

      // Draw particles with improved glow
      particles.forEach((particle) => {
        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap particles around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle glow
        const glow = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );
        glow.addColorStop(0, `rgba(100, 149, 237, ${particle.opacity * 0.8})`);
        glow.addColorStop(0.5, `rgba(100, 149, 237, ${particle.opacity * 0.3})`);
        glow.addColorStop(1, 'rgba(100, 149, 237, 0)');
        ctx.fillStyle = glow;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 149, 237, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw mouse interaction effect with improved glow
      const mouseGlow = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        150
      );
      mouseGlow.addColorStop(0, 'rgba(100, 149, 237, 0.15)');
      mouseGlow.addColorStop(0.5, 'rgba(100, 149, 237, 0.05)');
      mouseGlow.addColorStop(1, 'rgba(100, 149, 237, 0)');
      ctx.fillStyle = mouseGlow;
      ctx.fill();

      // Request next frame
      animationFrameId = requestAnimationFrame(drawGrid);
    };

    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    drawGrid();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default AnimatedBackground; 