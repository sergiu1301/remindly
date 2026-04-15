import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return <LoginClient />;
}