'use client';

import React, { useState } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const JoinClubPage: React.FC = () => {
  const [clubCode, setClubCode] = useState('');
  const router = useRouter();

  const handleJoinClub = () => {
    router.push(`/join/${clubCode}`);
  };

  return (
    <div className="py-6 px-6 items-center max-w-7xl mx-auto flex flex-col justify-center sm:px-6 lg:px-8">
      <p>Oops no estas validado, revisa tu correo y valida tu cuenta</p>
    </div>
  );
};

export default JoinClubPage;
