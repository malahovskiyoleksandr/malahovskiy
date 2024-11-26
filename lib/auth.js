import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

// Генерация токена
export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
}

// Проверка токена
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
