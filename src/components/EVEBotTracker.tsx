import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

interface EVEBotTrackerProps {
  size?: number; // Size in pixels
}

const blinkAnimation = keyframes`
  0%, 20%, 40%, 60%, 80%, 100% {
    transform: scaleY(1);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: scaleY(0.1);
  }
`;

const hoverAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Eye = styled.g<{ isBlinking: boolean }>`
  animation: ${({ isBlinking }) => (isBlinking ? `${blinkAnimation} 0.2s` : 'none')};
`;

const Body = styled.circle<{ hovered: boolean }>`
  animation: ${({ hovered }) => (hovered ? `${hoverAnimation} 1s infinite` : 'none')};
  transition: fill 0.3s, stroke 0.3s;
`;

const Smile = styled.path<{ isSmiling: boolean }>`
  opacity: ${({ isSmiling }) => (isSmiling ? 1 : 0)};
  transition: opacity 0.3s;
`;

const EVEBotTracker: React.FC<EVEBotTrackerProps> = ({ size = 128 }) => {
  const [eyePosition, setEyePosition] = useState({ x: 50, y: 50 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setEyePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000);

    const moveEyesInterval = setInterval(() => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      setEyePosition({ x, y });
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
      clearInterval(moveEyesInterval);
    };
  }, []);

  const handleSendMessage = async () => {
    setIsThinking(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate thinking for 2 seconds
    setIsThinking(false);
    setIsSmiling(true);
    setTimeout(() => setIsSmiling(false), 2000); // Smile for 2 seconds
  };

  const EyeComponent: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
    <Eye
      isBlinking={isBlinking}
      transform={`translate(${(eyePosition.x - 50) / 8}, ${(eyePosition.y - 50) / 8})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isBlinking ? (
        <rect x={cx - 7} y={cy - 3} width={14} height={6} fill="#000" />
      ) : (
        <g>
          {/* Eye white */}
          <circle
            cx={cx}
            cy={cy}
            r="8"
            fill="#fff"
            stroke="#000"
            strokeWidth="1"
          />
          {/* Iris */}
          <circle cx={cx} cy={cy} r="5" fill="#000" />
          {/* Pupil */}
          <circle cx={cx} cy={cy} r="2" fill="#FFEB3B" />
          {/* Eye highlight */}
          <circle cx={cx - 2} cy={cy - 2} r="1" fill="#fff" />
        </g>
      )}
    </Eye>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FF4500', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        {/* EVE's body */}
        <Body
          cx="50"
          cy="50"
          r="40"
          fill="url(#bodyGradient)" // Use gradient fill
          stroke="url(#bodyGradient)"
          strokeWidth="1"
          hovered={hovered}
        />

        {/* Head indent */}
        <path
          d="M30,30 Q50,25 70,30"
          fill="none"
          stroke="url(#bodyGradient)"
          strokeWidth="1"
        />

        {/* Eyes */}
        <EyeComponent cx={42} cy={45} />
        <EyeComponent cx={58} cy={45} />

        {/* Smile */}
        <Smile
          isSmiling={isSmiling}
          d="M35,60 Q50,75 65,60"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        />
      </svg>
   
    </div>
  );
};

export default EVEBotTracker;