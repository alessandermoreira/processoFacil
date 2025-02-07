import React, { useEffect, useState } from 'react';
import './css/BlinkingLight.css';

const BlinkingLight = () => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prevState => !prevState);
    }, 1000); // Alterne a cada 1 segundo (1000 ms) para piscar lentamente

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`light ${isBlinking ? 'on' : 'off'}`}></div>
  );
};

export default BlinkingLight;
