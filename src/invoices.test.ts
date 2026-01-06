import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app, { resetStore } from './app';

const validInvoice = {
  clientCif: 'B12345678',
  clientName: 'Empresa Ejemplo S.L.',
  clientAddress: 'Calle Mayor 10, 28001 Madrid',
  baseAmount: 100.0,
  vatAmount: 21.0,
};

describe('API de facturas', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('POST /invoices', () => {
    it('should create an invoice with status draft', async () => {
      const response = await request(app).post('/invoices').send(validInvoice);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        clientCif: validInvoice.clientCif,
        clientName: validInvoice.clientName,
        clientAddress: validInvoice.clientAddress,
        baseAmount: validInvoice.baseAmount,
        vatAmount: validInvoice.vatAmount,
        totalAmount: 121.0,
        status: 'draft',
        invoiceNumber: null,
        finalizedAt: null,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('should return 400 when clientCif is missing', async () => {
      const { clientCif, ...invoiceWithoutCif } = validInvoice;
      const response = await request(app).post('/invoices').send(invoiceWithoutCif);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 when clientName is missing', async () => {
      const { clientName, ...invoiceWithoutName } = validInvoice;
      const response = await request(app).post('/invoices').send(invoiceWithoutName);

      expect(response.status).toBe(400);
    });

    it('should return 400 when clientAddress is missing', async () => {
      const { clientAddress, ...invoiceWithoutAddress } = validInvoice;
      const response = await request(app).post('/invoices').send(invoiceWithoutAddress);

      expect(response.status).toBe(400);
    });

    it('should return 400 when baseAmount is missing', async () => {
      const { baseAmount, ...invoiceWithoutBase } = validInvoice;
      const response = await request(app).post('/invoices').send(invoiceWithoutBase);

      expect(response.status).toBe(400);
    });

    it('should return 400 when vatAmount is missing', async () => {
      const { vatAmount, ...invoiceWithoutVat } = validInvoice;
      const response = await request(app).post('/invoices').send(invoiceWithoutVat);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /invoices', () => {
    it('should return an empty array when no invoices exist', async () => {
      const response = await request(app).get('/invoices');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all invoices', async () => {
      await request(app).post('/invoices').send(validInvoice);
      await request(app).post('/invoices').send(validInvoice);

      const response = await request(app).get('/invoices');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter invoices by status=draft', async () => {
      // Crear 3 facturas borrador
      await request(app).post('/invoices').send(validInvoice);
      await request(app).post('/invoices').send(validInvoice);
      await request(app).post('/invoices').send(validInvoice);

      // Crear 2 facturas finalizadas
      const final1 = await request(app).post('/invoices').send(validInvoice);
      const final2 = await request(app).post('/invoices').send(validInvoice);
      await request(app).patch(`/invoices/${final1.body.id}/finalize`);
      await request(app).patch(`/invoices/${final2.body.id}/finalize`);

      const response = await request(app).get('/invoices?status=draft');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body.every((inv: { status: string }) => inv.status === 'draft')).toBe(true);
    });

    it('should filter invoices by status=final', async () => {
      // Crear 2 facturas borrador
      await request(app).post('/invoices').send(validInvoice);
      await request(app).post('/invoices').send(validInvoice);

      // Crear 3 facturas finalizadas
      const final1 = await request(app).post('/invoices').send(validInvoice);
      const final2 = await request(app).post('/invoices').send(validInvoice);
      const final3 = await request(app).post('/invoices').send(validInvoice);
      await request(app).patch(`/invoices/${final1.body.id}/finalize`);
      await request(app).patch(`/invoices/${final2.body.id}/finalize`);
      await request(app).patch(`/invoices/${final3.body.id}/finalize`);

      const response = await request(app).get('/invoices?status=final');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body.every((inv: { status: string }) => inv.status === 'final')).toBe(true);
    });
  });

  describe('GET /invoices/:id', () => {
    it('should return an invoice by id', async () => {
      const createResponse = await request(app).post('/invoices').send(validInvoice);
      const invoiceId = createResponse.body.id;

      const response = await request(app).get(`/invoices/${invoiceId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(invoiceId);
      expect(response.body.clientCif).toBe(validInvoice.clientCif);
    });

    it('should return 404 when invoice does not exist', async () => {
      const response = await request(app).get('/invoices/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('PATCH /invoices/:id/finalize', () => {
    it('should finalize a draft invoice', async () => {
      const createResponse = await request(app).post('/invoices').send(validInvoice);
      const invoiceId = createResponse.body.id;

      const response = await request(app).patch(`/invoices/${invoiceId}/finalize`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(invoiceId);
      expect(response.body.status).toBe('final');
      expect(response.body.invoiceNumber).toMatch(/^BT\d+$/);
      expect(response.body.finalizedAt).toBeDefined();
    });

    it('should assign sequential invoice numbers', async () => {
      const create1 = await request(app).post('/invoices').send(validInvoice);
      const create2 = await request(app).post('/invoices').send(validInvoice);

      const finalize1 = await request(app).patch(`/invoices/${create1.body.id}/finalize`);
      const finalize2 = await request(app).patch(`/invoices/${create2.body.id}/finalize`);

      expect(finalize1.body.invoiceNumber).toBe('BT001');
      expect(finalize2.body.invoiceNumber).toBe('BT002');
    });

    it('should return 400 when invoice is already finalized', async () => {
      const createResponse = await request(app).post('/invoices').send(validInvoice);
      const invoiceId = createResponse.body.id;
      await request(app).patch(`/invoices/${invoiceId}/finalize`);

      const response = await request(app).patch(`/invoices/${invoiceId}/finalize`);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return 404 when invoice does not exist', async () => {
      const response = await request(app).patch('/invoices/00000000-0000-0000-0000-000000000000/finalize');

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(404);
    });
  });

  describe('DELETE /invoices/:id', () => {
    it('should delete a draft invoice', async () => {
      const createResponse = await request(app).post('/invoices').send(validInvoice);
      const invoiceId = createResponse.body.id;

      const response = await request(app).delete(`/invoices/${invoiceId}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app).get(`/invoices/${invoiceId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 400 when trying to delete a finalized invoice', async () => {
      const createResponse = await request(app).post('/invoices').send(validInvoice);
      const invoiceId = createResponse.body.id;
      await request(app).patch(`/invoices/${invoiceId}/finalize`);

      const response = await request(app).delete(`/invoices/${invoiceId}`);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return 404 when invoice does not exist', async () => {
      const response = await request(app).delete('/invoices/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
      expect(response.body.code).toBe(404);
    });
  });
});
