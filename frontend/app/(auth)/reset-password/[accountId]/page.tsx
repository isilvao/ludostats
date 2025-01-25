'use client';

import { useParams } from 'next/navigation';
import SetNewPasswordForm from '@/components/SetNewPassword';

const ResetPasswordPage = () => {
  const { accountId } = useParams();

  if (!accountId) {
    return <p>Loading...</p>;
  }

  return <SetNewPasswordForm accountId={accountId as string} />;
};

export default ResetPasswordPage;
