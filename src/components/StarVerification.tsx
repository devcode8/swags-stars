'use client';

import { useState } from 'react';

interface StarVerificationProps {
  onVerificationSuccess: (username: string) => void;
}

export default function StarVerification({ onVerificationSuccess }: StarVerificationProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your GitHub username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Verifying star for username:', username.trim());
      
      const response = await fetch('/api/verify-star', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (!response.ok) {
        console.error('API error:', response.status, data.error);
        setError(data.error || 'Failed to verify star');
        return;
      }

      if (data.hasStarred) {
        onVerificationSuccess(username.trim());
      } else {
        setError(`You haven't starred the repository yet. Please star it first! (Checked for user: ${username.trim()})`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8 md:mb-10">
          <div className="text-4xl md:text-6xl mb-4">🎁</div>
          <h1 className="text-2xl md:text-3xl font-light text-white mb-3">
            ETH Global
          </h1>
          <p className="text-white/70 text-sm font-light mb-6">
            First, star our repository to participate
          </p>
          
          <div className="mb-6 md:mb-8">
            <a
              href="https://github.com/fetchai/innovation-lab-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 md:gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl transition-all duration-300 font-semibold text-sm md:text-base shadow-xl hover:shadow-2xl transform hover:scale-105 border border-white/30 hover:border-white/50"
            >
              <span className="text-lg md:text-xl">⭐</span>
              <span>Star Repository</span>
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          
          <div className="text-white/50 text-xs font-light flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            <span>Then enter your username below</span>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 text-sm md:text-base"
              placeholder="GitHub username"
              required
            />
            <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-white/30">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {error && (
            <div className="p-3 md:p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 rounded-2xl text-xs md:text-sm font-light">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 md:py-4 px-4 md:px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-sm md:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : (
              'Enter the Experience'
            )}
          </button>
        </form>
        
        <div className="text-center mt-6 md:mt-8 text-white/40 text-xs font-light">
          Verify your star and spin for amazing prizes
        </div>
      </div>
    </div>
  );
}