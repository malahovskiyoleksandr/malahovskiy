import { generateToken } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();

  // Пример проверки учетных данных (захардкожено для примера)
  if (email === 'maksimkrygliak@gmail.com' && password === '123') {
    const token = generateToken({ email, role: 'admin' }); // Создаем токен
    return new Response(JSON.stringify({ token }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
}
