import { generateToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    // Пример проверки данных (вы заменяете на реальную логику)
    if (email === '123@gmail.com' && password === '123') {
      const token = generateToken({ email, role: 'admin' });
      return new Response(JSON.stringify({ token }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
