import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

describe('Autenticación', () => {
  describe('GET /protected', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app).get('/protected');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe(401);
      expect(response.body.message).toBe('Token no proporcionado');
    });

    it('should return 401 when token format is invalid', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'InvalidFormat token123');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token no proporcionado');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer wrong-token');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe(401);
      expect(response.body.message).toBe('Token inválido');
    });

    it('should return 200 when token is valid', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer my-secret-token-123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Acceso autorizado');
    });
  });
});
