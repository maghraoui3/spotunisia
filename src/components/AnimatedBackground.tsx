
import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      originX: number;
      originY: number;
      mouseEffect: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originX = this.x;
        this.originY = this.y;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = '#ffffff';
        this.opacity = Math.random() * 0.5 + 0.1;
        this.mouseEffect = Math.random() * 30 + 20;
      }

      update(mouseX: number | null, mouseY: number | null) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Apply mouse influence if mouse position is available
        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If mouse is close enough, particles move away from mouse
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            const repelForce = (100 - distance) / 500;
            this.x -= Math.cos(angle) * repelForce * this.mouseEffect;
            this.y -= Math.sin(angle) * repelForce * this.mouseEffect;
          } else {
            // Gradually return to original position when not influenced by mouse
            this.x += (this.originX - this.x) * 0.01;
            this.y += (this.originY - this.y) * 0.01;
          }
        }

        // Wrap around screen edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particle array
    const particleCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 10000));
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse tracking
    let mouseX: number | null = null;
    let mouseY: number | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update spotlight position
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${mouseX}px`;
        spotlightRef.current.style.top = `${mouseY}px`;
        spotlightRef.current.classList.add('active');
      }
    };
    
    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
      
      // Hide spotlight
      if (spotlightRef.current) {
        spotlightRef.current.classList.remove('active');
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Clear canvas with semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(10, 10, 12, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw();
      });
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      <div ref={spotlightRef} className="spotlight"></div>
    </>
  );
};

export default AnimatedBackground;
