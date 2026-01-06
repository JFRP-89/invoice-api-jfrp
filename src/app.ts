import express from 'express';
import { PostgresInvoiceRepository } from './repositories/PostgresInvoiceRepository';
import { pool } from './config/database';
import { CreateInvoiceUseCase } from './use-cases/CreateInvoiceUseCase';
import { GetInvoicesUseCase } from './use-cases/GetInvoicesUseCase';
import { GetInvoiceByIdUseCase } from './use-cases/GetInvoiceByIdUseCase';
import { FinalizeInvoiceUseCase } from './use-cases/FinalizeInvoiceUseCase';
import { DeleteInvoiceUseCase } from './use-cases/DeleteInvoiceUseCase';
import { requestLogger } from './middlewares/requestLogger';
import { auth } from './middlewares/auth';

const app = express();
const invoiceRepository = new PostgresInvoiceRepository(pool);

app.use(requestLogger);
app.use(express.json());

export async function resetStore(): Promise<void> {
  await invoiceRepository.reset();
}

app.get('/invoices', async (req, res) => {
  const status = req.query.status as 'draft' | 'final' | undefined;
  const invoices = await GetInvoicesUseCase(invoiceRepository, { status });
  res.status(200).json(invoices);
});

app.post('/invoices', async (req, res) => {
  const result = await CreateInvoiceUseCase(invoiceRepository, req.body);

  if (!result.success) {
    res.status(400).json({
      code: 400,
      message: result.error,
    });
    return;
  }

  res.status(201).json(result.invoice);
});

app.get('/invoices/:id', async (req, res) => {
  const result = await GetInvoiceByIdUseCase(invoiceRepository, { id: req.params.id });

  if (!result.success) {
    res.status(result.code).json({
      code: result.code,
      message: result.error,
    });
    return;
  }

  res.status(200).json(result.invoice);
});

app.patch('/invoices/:id/finalize', async (req, res) => {
  const result = await FinalizeInvoiceUseCase(invoiceRepository, { id: req.params.id });

  if (!result.success) {
    res.status(result.code).json({
      code: result.code,
      message: result.error,
    });
    return;
  }

  res.status(200).json(result.invoice);
});

app.delete('/invoices/:id', async (req, res) => {
  const result = await DeleteInvoiceUseCase(invoiceRepository, { id: req.params.id });

  if (!result.success) {
    res.status(result.code).json({
      code: result.code,
      message: result.error,
    });
    return;
  }

  res.status(204).send();
});

app.get('/protected', auth, (req, res) => {
  res.status(200).json({ message: 'Acceso autorizado' });
});

export default app;
