'use client';

import { useRouter } from 'next/router';
import SetNewPasswordForm from '@/components/SetNewPassword';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { accountId } = router.query;

  if (!accountId) {
    return <p>Loading...</p>;
  }

  return <SetNewPasswordForm accountId={accountId as string} />;
};

export default ResetPasswordPage;
