'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface SpinWheelProps {
  username: string;
}

const prizes = [
  { name: 'T-Shirt', color: '#FF6B6B', image: '/swags/tshirt.png', type: 'image' },
  { name: 'Water Bottle', color: '#4ECDC4', image: '/swags/bootle.png', type: 'image' },
  { name: 'Cap', color: '#45B7D1', image: '/swags/cap.png', type: 'image' },
  { name: 'Pen', color: '#F9CA24', image: '/swags/pen.png', type: 'image' },
  { name: 'Diary', color: '#6C5CE7', emoji: '📓', type: 'emoji' }
];

export default function SpinWheel({ username }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsCheckingUser(true);
        const response = await fetch(`/api/sheets?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        if (data.exists) {
          setUserExists(true);
          setHasSpun(true);
          setWinner(data.prize || 'Unknown Prize');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setError('Failed to check user status');
      } finally {
        setIsCheckingUser(false);
      }
    };

    if (username) {
      checkUser();
    }
  }, [username]);

  const addUserToSheet = async (prize: string) => {
    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          prize
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error adding user to sheet:', error);
      setError('Failed to save your result');
    }
  };

  const spin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const winningPrize = prizes[randomIndex];
    
    const segmentAngle = 360 / prizes.length;
    const spins = 5; // Number of full rotations
    // Adjust for pointer position (top) and prize offset
    const prizeAngle = (randomIndex * segmentAngle) + (segmentAngle / 2);
    const targetAngle = 360 * spins - prizeAngle + (segmentAngle / 2);

    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${targetAngle}deg)`;
    }

    setTimeout(async () => {
      setIsSpinning(false);
      setWinner(winningPrize.name);
      setHasSpun(true);
      
      await addUserToSheet(winningPrize.name);
    }, 3000);
  };

  const resetSpin = () => {
    setHasSpun(false);
    setWinner(null);
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  if (isCheckingUser) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-light text-gray-800 mb-2">Checking your status...</h2>
          <p className="text-gray-500 text-sm">Please wait while we verify your account</p>
        </div>
      </div>
    );
  }

  if (userExists) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-light text-gray-800 mb-4">Welcome back!</h2>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl mb-4">
            <p className="font-medium mb-2">You&apos;ve already spun the wheel!</p>
            <p className="text-sm">Your prize: <span className="font-semibold">{winner}</span></p>
          </div>
          <p className="text-gray-500 text-sm">Each user can only spin once. Show this screen at the ETH Global booth to claim your prize.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl text-center h-full max-h-[95vh] flex flex-col justify-between">
        <div className="">
          <h1 className="text-3xl font-light text-gray-800 mb-3">
            Welcome {username}
          </h1>
          <p className="text-gray-500 text-base font-light mb-8">
            Spin the wheel to discover your ETH Global swag
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="relative mx-auto" style={{ width: '400px', height: '400px' }}>
            <div
              ref={wheelRef}
              className="relative w-full h-full rounded-full shadow-2xl transition-transform duration-3000 ease-out"
              style={{
                background: `conic-gradient(${prizes.map((prize, index) => {
                  const start = (index / prizes.length) * 360;
                  const end = ((index + 1) / prizes.length) * 360;
                  return `${prize.color} ${start}deg ${end}deg`;
                }).join(', ')})`,
                filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.1))',
              }}
            >
              
              {/* Prize Items */}
              {prizes.map((prize, index) => {
                const angle = (index / prizes.length) * 360 + (360 / prizes.length / 2);
                const radius = 120;
                return (
                  <div
                    key={prize.name}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                      transformOrigin: '50% 60px'
                    }}
                  >
                    <div 
                      style={{ transform: `rotate(${-angle}deg)` }} 
                      className="flex flex-col items-center w-20"
                    >
                      {prize.type === 'image' ? (
                        <div className="bg-white/95 rounded-2xl p-4 shadow-lg mb-3 w-16 h-16 flex items-center justify-center backdrop-blur-sm">
                          <Image
                            src={prize.image!}
                            alt={prize.name}
                            width={36}
                            height={36}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="bg-white/95 rounded-2xl p-4 shadow-lg mb-3 w-16 h-16 flex items-center justify-center text-3xl backdrop-blur-sm">
                          {prize.emoji}
                        </div>
                      )}
                      <div className="text-white font-bold text-sm bg-black/70 px-3 py-1.5 rounded-full text-center whitespace-nowrap shadow-lg backdrop-blur-sm">
                        {prize.name}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Center Hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-xl flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-inner"></div>
              </div>
            </div>
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
              <div className="relative">
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-yellow-500 drop-shadow-lg filter drop-shadow-md"></div>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          {!hasSpun ? (
            <div className="space-y-6">
              <button
                onClick={spin}
                disabled={isSpinning}
                className={`px-12 py-3 text-lg font-medium transition-all duration-200 rounded-xl ${
                  isSpinning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-900 active:scale-95'
                }`}
              >
                {isSpinning ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    Spinning...
                  </span>
                ) : (
                  'Spin the Wheel'
                )}
              </button>
              
              <p className="text-gray-400 font-light">
                Click above to discover your prize
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 text-gray-800 p-6 rounded-2xl">
                <div className="text-3xl mb-4">🎉</div>
                <h2 className="text-2xl font-light mb-4">Congratulations!</h2>
                <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                  <p className="text-xl font-medium text-gray-800">
                    You won: <span className="font-semibold">{winner}</span>
                  </p>
                </div>
                <div className="text-base font-light text-gray-600">
                  Your swag is ready for pickup
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 p-5 rounded-2xl">
                <p className="text-gray-700 font-medium mb-2">
                  Show this screen at the ETH Global booth to claim your prize
                </p>
                <p className="text-sm text-gray-500 font-light">
                  Screenshot recommended for your records
                </p>
              </div>
              
              <button
                onClick={resetSpin}
                className="px-8 py-3 bg-gray-100 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Spin Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}