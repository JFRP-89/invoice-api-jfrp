import { Request, Response, NextFunction } from 'express';

const VALID_TOKEN = 'my-secret-token-123';

export function auth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      code: 401,
      message: 'Token no proporcionado',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (token !== VALID_TOKEN) {
    res.status(401).json({
      code: 401,
      message: 'Token inválido',
    });
    return;
  }

  next();
}
