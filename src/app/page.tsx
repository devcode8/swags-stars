'use client';

import { useState } from 'react';
import StarVerification from '@/components/StarVerification';
import SpinWheel from '@/components/SpinWheel';

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [username, setUsername] = useState('');

  const handleVerificationSuccess = (verifiedUsername: string) => {
    setUsername(verifiedUsername);
    setIsVerified(true);
  };

  if (isVerified) {
    return <SpinWheel username={username} />;
  }

  return <StarVerification onVerificationSuccess={handleVerificationSuccess} />;
}
