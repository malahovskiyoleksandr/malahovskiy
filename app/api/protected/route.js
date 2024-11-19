import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No token provided' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1]; // Извлекаем токен из заголовка

  const user = verifyToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 403 });
  }

  return new Response(JSON.stringify({ message: 'Access granted', user }), { status: 200 });
}
