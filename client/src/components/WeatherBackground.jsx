import React, { useEffect, useRef } from 'react';

export default function WeatherBackground({ ambient = 'clear', isDay = true }) {
  const canvasRef = useRef(null);

  // Map ambient name to css class
  const getThemeClass = () => {
    if (ambient === 'rain' || ambient === 'drizzle' || ambient === 'heavy-rain') return 'theme-rain';
    if (ambient === 'thunderstorm') return 'theme-thunderstorm';
    if (ambient === 'snow') return 'theme-snow';
    if (ambient === 'cloudy') return 'theme-cloudy';
    if (ambient === 'fog') return 'theme-fog';
    return isDay ? 'theme-clear-day' : 'theme-clear-night';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setup
    const particles = [];
    const particleCount = ambient.includes('rain') ? 140 : (ambient === 'snow' ? 100 : (isDay ? 25 : 80));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * (ambient === 'snow' ? 3.5 : (isDay ? 2 : 1.5)) + 0.5,
        length: Math.random() * 20 + 10,
        speedX: ambient === 'snow' ? Math.random() * 1.5 - 0.75 : (ambient.includes('rain') ? -1.5 : Math.random() * 0.4 - 0.2),
        speedY: ambient.includes('rain') ? Math.random() * 12 + 10 : (ambient === 'snow' ? Math.random() * 2 + 1 : Math.random() * 0.3 - 0.15),
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }

    let lightningTimer = 0;
    let lightningOpacity = 0;

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Thunderstorm lightning effect
      if (ambient === 'thunderstorm') {
        lightningTimer++;
        if (lightningTimer > 180 && Math.random() < 0.015) {
          lightningOpacity = 0.6 + Math.random() * 0.3;
          lightningTimer = 0;
        }
        if (lightningOpacity > 0) {
          ctx.fillStyle = `rgba(230, 240, 255, ${lightningOpacity})`;
          ctx.fillRect(0, 0, width, height);
          lightningOpacity *= 0.85;
          if (lightningOpacity < 0.02) lightningOpacity = 0;
        }
      }

      // Render weather particles
      for (let p of particles) {
        if (ambient.includes('rain')) {
          // Rain streaks
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        } else if (ambient === 'snow') {
          // Snow flakes
          ctx.fillStyle = `rgba(240, 249, 255, ${p.opacity * 0.85})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speedY;
          p.x += p.speedX + Math.sin(frame * 0.02 + p.twinkleOffset) * 0.5;
          if (p.y > height) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        } else if (!isDay) {
          // Night stars twinkling
          const twinkle = Math.sin(frame * p.twinkleSpeed + p.twinkleOffset);
          const currentOpacity = Math.max(0.1, (twinkle + 1) / 2 * p.opacity);

          ctx.fillStyle = `rgba(224, 231, 255, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Day dust / glowing ambient floating motes
          const currentOpacity = Math.max(0.05, Math.sin(frame * 0.01 + p.twinkleOffset) * 0.3 * p.opacity);
          ctx.fillStyle = `rgba(254, 240, 138, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ambient, isDay]);

  return (
    <>
      <div className={`ambient-gradient-mesh ${getThemeClass()}`} />
      <div className="weather-canvas-container">
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
