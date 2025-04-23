import { auth } from '@/auth';
import { redirect } from 'next/navigation';


export default async function Page({ searchParams }: { searchParams: Promise<{ email?: string; token?: string }> }) {
  const session = await auth();
  const { email, token } = await searchParams;

  if (session) redirect('/');

  let success = false;

  if (email && token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?email=${email}&token=${token}`);
      const data = await res.json();
      success = data.success;
    } catch (error) {
      console.error('Ошибка верификации email:', error);
    }
  }

  return (
    <div className="center" style={{ color: success ? 'green' : 'red' }}>
      {success
        ? 'Ваш email подтвержден! Теперь вы можете войти в систему'
        : 'Ошибка подтверждения email'}
    </div>
  );
}